import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bot, Plus, Send, UserRound, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";
import api from "../api";

// React StrictMode chạy effect hai lần trong development. Cache Promise đang
// xử lý để hai effect cùng chờ một request thay vì gọi backend hai lần.
const pendingInitialRequests = new Map();

const requestInitialAdvice = (payload) => {
  const key = JSON.stringify(payload);
  if (!pendingInitialRequests.has(key)) {
    const request = api.post("/chat", payload).finally(() => {
      pendingInitialRequests.delete(key);
    });
    pendingInitialRequests.set(key, request);
  }
  return pendingInitialRequests.get(key);
};

const answerToMarkdown = (answer) => {
  if (!answer) return "";
  if (answer.loai_phan_hoi === "tra_loi_tiep" || answer.noi_dung_tra_loi) {
    return (
      answer.noi_dung_tra_loi ||
      "Mình chưa có đủ thông tin để trả lời câu hỏi này."
    );
  }

  const sections = [];
  if (answer.mo_ta_nganh) sections.push(`## Tổng quan\n${answer.mo_ta_nganh}`);
  if (answer.ly_do_phu_hop)
    sections.push(`## Vì sao phù hợp với bạn?\n${answer.ly_do_phu_hop}`);
  if (answer.thong_bao_dinh_huong) {
    sections.push(
      `> **Lưu ý về định hướng**\n> ${answer.thong_bao_dinh_huong}`,
    );
  }
  if (answer.goi_y_tiep_theo)
    sections.push(`## Bạn có thể làm gì tiếp theo?\n${answer.goi_y_tiep_theo}`);
  if (answer.nguon_tham_khao) {
    sections.push(
      `---\n**Nguồn tham khảo:** [Xem bài giới thiệu ngành tại Đại học Cần Thơ](${answer.nguon_tham_khao})`,
    );
  }

  return sections.join("\n\n");
};

const MarkdownContent = ({ children }) => (
  <ReactMarkdown
    components={{
      h2: ({ children: heading }) => (
        <h2 className="mt-6 mb-2 text-lg font-bold text-base-content first:mt-0">
          {heading}
        </h2>
      ),
      p: ({ children: paragraph }) => (
        <p className="mb-3 whitespace-pre-wrap leading-7 text-base-content/80 last:mb-0">
          {paragraph}
        </p>
      ),
      ul: ({ children: list }) => (
        <ul className="mb-3 ml-5 list-disc space-y-1">{list}</ul>
      ),
      ol: ({ children: list }) => (
        <ol className="mb-3 ml-5 list-decimal space-y-1">{list}</ol>
      ),
      blockquote: ({ children: quote }) => (
        <blockquote className="my-4 rounded-r-xl border-l-4 border-warning bg-warning/10 px-4 py-3 text-left">
          {quote}
        </blockquote>
      ),
      hr: () => <hr className="my-5 border-base-300" />,
      a: ({ href, children: label }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
        >
          {label}
        </a>
      ),
    }}
  >
    {children}
  </ReactMarkdown>
);

const launchConfetti = () => {
  confetti({
    particleCount: 90,
    spread: 80,
    origin: { y: 0.65 },
    zIndex: 1000,
  });
};

const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const shortTitle = (content, fallback = "Câu hỏi mới") => {
  const normalized = content.trim().replace(/\s+/g, " ");
  if (!normalized) return fallback;
  return normalized.length > 42 ? `${normalized.slice(0, 42)}…` : normalized;
};

export default function Phase3({ userData2, onBack }) {
  const [hasInitialResult, setHasInitialResult] = useState(false);
  const [topics, setTopics] = useState([]);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingTopicIds, setSendingTopicIds] = useState([]);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  const selectedGroup =
    userData2?.selectedGroup?.NhomNganh || "Nhóm ngành đã chọn";
  const initialPrompt = userData2?.prompt || "";

  useEffect(() => {
    if (!userData2) return;
    let cancelled = false;

    const loadInitialAdvice = async () => {
      try {
        const response = await requestInitialAdvice({
          group_major: selectedGroup,
          describe: initialPrompt,
          history: [],
        });

        if (!cancelled) {
          const answer = response.data.answer;
          const topicId = createId();
          setHasInitialResult(true);
          setTopics([
            {
              id: topicId,
              title: shortTitle(initialPrompt, "Tư vấn ban đầu"),
              draft: "",
              messages: [
                { role: "user", content: initialPrompt },
                {
                  role: "assistant",
                  content: answerToMarkdown(answer),
                  answer,
                },
              ],
            },
          ]);
          setActiveTopicId(topicId);
          if (answer.phu_hop_nhom) launchConfetti();
        }
      } catch (requestError) {
        console.error("Không thể gọi API tư vấn", requestError);
        if (!cancelled)
          setError(
            "Không thể tạo kết quả tư vấn. Vui lòng quay lại và thử lại.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadInitialAdvice();
    return () => {
      cancelled = true;
    };
  }, [userData2, selectedGroup, initialPrompt]);

  const activeTopic =
    topics.find((topic) => topic.id === activeTopicId) ?? topics[0];
  const messages = activeTopic?.messages ?? [];
  const draft = activeTopic?.draft ?? "";
  const sending = sendingTopicIds.includes(activeTopic?.id);

  useEffect(() => {
    if (messages.length > 2 || sending) {
      chatEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeTopicId, messages.length, sending]);

  const updateTopic = (topicId, updater) => {
    setTopics((current) =>
      current.map((topic) => (topic.id === topicId ? updater(topic) : topic)),
    );
  };

  const addTopic = () => {
    const topicId = createId();
    setTopics((current) => [
      ...current,
      { id: topicId, title: "Câu hỏi mới", draft: "", messages: [] },
    ]);
    setActiveTopicId(topicId);
  };

  const removeTopic = (topicId) => {
    if (topics.length === 1 || sendingTopicIds.includes(topicId)) return;
    const removedIndex = topics.findIndex((topic) => topic.id === topicId);
    const remaining = topics.filter((topic) => topic.id !== topicId);
    setTopics(remaining);
    if (activeTopicId === topicId) {
      const nextIndex = Math.min(Math.max(removedIndex - 1, 0), remaining.length - 1);
      setActiveTopicId(remaining[nextIndex].id);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || sending || !activeTopic) return;

    const topicId = activeTopic.id;
    const apiHistory = activeTopic.messages
      .map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      }))
      .slice(-8);

    updateTopic(topicId, (topic) => ({
      ...topic,
      title:
        topic.messages.length === 0 ? shortTitle(content) : topic.title,
      draft: "",
      messages: [...topic.messages, { role: "user", content }],
    }));
    setSendingTopicIds((current) => [...current, topicId]);
    setError("");

    try {
      const response = await api.post("/chat", {
        group_major: selectedGroup,
        describe: content,
        history: apiHistory,
      });
      const answer = response.data.answer;
      updateTopic(topicId, (topic) => ({
        ...topic,
        messages: [
          ...topic.messages,
          { role: "assistant", content: answerToMarkdown(answer), answer },
        ],
      }));
    } catch (requestError) {
      console.error("Không thể gửi câu hỏi tiếp theo", requestError);
      updateTopic(topicId, (topic) => ({
        ...topic,
        messages: [
          ...topic.messages,
          {
            role: "assistant",
            content:
              "Mình chưa thể trả lời lúc này. Bạn vui lòng thử gửi lại câu hỏi.",
          },
        ],
      }));
    } finally {
      setSendingTopicIds((current) =>
        current.filter((currentId) => currentId !== topicId),
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <h2 className="mt-6 text-2xl font-bold">Đang tạo kết quả tư vấn</h2>
        <p className="mt-3 max-w-lg text-base-content/65">
          AI đang đối chiếu sở thích của bạn với thông tin các ngành học. Quá
          trình này có thể mất một chút thời gian.
        </p>
      </div>
    );
  }

  if (error && !hasInitialResult) {
    return (
      <div className="alert alert-error mx-auto max-w-xl">
        <span>{error}</span>
        <button className="btn btn-sm" onClick={onBack}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    // <motion.main
    //   initial={{ opacity: 0, y: 12 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   className="relative mx-auto h-[calc(100dvh-5rem)] min-h-[36rem] w-full max-w-[90rem] overflow-hidden rounded-3xl border border-primary/15 bg-base-100 shadow-2xl"
    // >
    <div className="h-[calc(100dvh-9rem)]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex h-full min-h-0 flex-col ">
        <div className=" flex shrink-0 items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="btn btn-ghost btn-circle"
            aria-label="Quay lại"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="badge badge-primary badge-outline max-w-[70%] truncate px-4 py-3">
            Nhóm đã chọn: {selectedGroup}
          </span>
        </div>

        <section
          className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col"
          aria-labelledby="chat-heading"
        >
          <div className="mb-3 flex shrink-0 items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {topics.map((topic, index) => {
              const isActive = topic.id === activeTopic?.id;
              const isPending = sendingTopicIds.includes(topic.id);
              return (
                <div
                  key={topic.id}
                  className={`group flex shrink-0 items-center rounded-full border transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-primary-content"
                      : "border-base-300 bg-base-100 hover:border-primary/50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTopicId(topic.id)}
                    className="flex max-w-64 items-center gap-2 py-2 pl-4 pr-2 text-sm font-medium"
                    title={topic.title}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="opacity-70">#{index + 1}</span>
                    <span className="truncate">{topic.title}</span>
                    {isPending && (
                      <span className="loading loading-spinner loading-xs" />
                    )}
                  </button>
                  {topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(topic.id)}
                      disabled={isPending}
                      className="mr-1 rounded-full p-1.5 opacity-60 hover:bg-black/10 hover:opacity-100 disabled:cursor-not-allowed"
                      aria-label={`Đóng ${topic.title}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={addTopic}
              className="btn btn-sm shrink-0 rounded-full border-dashed"
            >
              <Plus className="h-4 w-4" /> Câu hỏi mới
            </button>
          </div>
          {/* <div className="mb-4 flex shrink-0 items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            
          </div> */}

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto rounded-2xl bg-base-200/25 p-4 [scrollbar-gutter:stable] md:p-6">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${message.role === "user" ? "bg-primary text-primary-content" : "bg-secondary text-secondary-content"}`}
                  aria-hidden="true"
                >
                  {message.role === "user" ? (
                    <UserRound className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-left md:px-6 md:py-4 ${message.role === "user" ? "rounded-tr-sm bg-primary text-primary-content" : "rounded-tl-sm border border-base-300 bg-base-100 text-base-content shadow-sm"}`}
                >
                  {message.role === "assistant" ? (
                    <MarkdownContent>{message.content}</MarkdownContent>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-content">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-xl rounded-tl-sm border border-base-300 bg-base-100 px-5 py-3 shadow-sm">
                  <span className="loading loading-dots loading-sm" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="mt-4 flex shrink-0 items-end gap-3"
          >
            <label className="form-control flex-1">
              <span className="sr-only">Nhập câu hỏi tiếp theo</span>
              <textarea
                value={draft}
                onChange={(event) => {
                  const nextDraft = event.target.value;
                  updateTopic(activeTopic.id, (topic) => ({
                    ...topic,
                    draft: nextDraft,
                  }));
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                className="textarea textarea-bordered min-h-14 w-full resize-none rounded-xl focus:textarea-primary"
                placeholder={
                  messages.length === 0
                    ? "Nhập câu hỏi cho chủ đề mới..."
                    : "Hỏi tiếp trong chủ đề này..."
                }
                rows={2}
                disabled={sending}
              />
            </label>
            <button
              className="btn btn-primary h-14 rounded-xl px-5"
              disabled={!draft.trim() || sending}
              aria-label="Gửi câu hỏi"
            >
              <Send className="h-5 w-5" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
        </section>

        {/* <div className="mt-4 shrink-0 text-center">
          <button
            onClick={() => {
              playClickSound();
              onRestart();
            }}
            className="btn btn-outline btn-primary rounded-2xl px-8"
          >
            <RefreshCcw className="h-4 w-4" /> Bắt đầu lại
          </button>
        </div> */}
      </div>
    </div>
    // </motion.main>
  );
}
