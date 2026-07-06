import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, RefreshCcw, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { playClickSound } from "../utils/audio";
import axios from "axios";
export default function Phase3({ userData2, onBack, onRestart }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(userData2);
  const banPhaoBong = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 1000,
    };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      });

      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      });
    }, 250);
  };

  const handleRestart = () => {
    playClickSound();
    onRestart();
  };

  const handleBack = () => {
    playClickSound();
    onBack();
  };

  //gọi model llm rag
  const call_chat = async () => {
    const dataSendChat = {
      group_major: userData2.selectedGroup.NhomNganh,
      describe: userData2.prompt,
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat/", dataSendChat);
      setResult(res.data.answer);
      console.log(res.data.answer);
      banPhaoBong();
    } catch (err) {
      console.log("Co loi o ham call_chat, file Phase3.jsx", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!userData2) return;

    call_chat();
  }, [userData2]);

  //   return {
  //     title: results.ten_nganh,
  //     subtitle: `Chuyên ngành hoàn hảo nhất thuộc ${groupName}`,
  //     description: `Dựa trên điểm số học tập xuất sắc và nhóm tính cách Holland của bạn, kết hợp với mong muốn: "${data?.userPrompt || ''}", hệ thống AI nhận định Kỹ Thuật Phần Mềm là lựa chọn lý tưởng nhất.`,
  //     reasons: [
  //       "Phù hợp với tư duy logic và khả năng phân tích từ kết quả trắc nghiệm.",
  //       "Đáp ứng được sở thích sáng tạo và phát triển sản phẩm công nghệ.",
  //       "Điểm số các môn khoa học tự nhiên rất nền tảng cho ngành này.",
  //       "Cơ hội phát triển nghề nghiệp cao đúng như mong muốn của bạn."
  //     ]
  //   };
  // };

  // const result = getResult();
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="mt-6 text-2xl font-bold">Đang tạo kết quả tư vấn</h2>

        <div className="mt-3 flex gap-1">
          <span className="loading loading-dots loading-md text-primary"></span>
        </div>

        <p className="mt-5 max-w-md text-center text-base-content/70">
          AI đang đọc thông tin ngành học và phân tích mức độ phù hợp với sở
          thích của bạn.
        </p>

        <div className="alert alert-warning mt-8 max-w-xl">
          <span>
            Đây là bản thử nghiệm. Thời gian xử lý có thể kéo dài vài phút. Vui
            lòng không tải lại trang trong lúc AI đang làm việc.
          </span>
        </div>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      className="max-w-4xl mx-auto p-6 lg:p-10 bg-base-100 rounded-3xl shadow-2xl border border-primary/20 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center mb-8 relative z-10">
        <button
          onClick={handleBack}
          className="btn btn-ghost btn-circle text-base-content/70 hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center relative z-10 space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary text-white shadow-xl mb-4"
        >
          <GraduationCap className="w-12 h-12" />
        </motion.div>

        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-secondary font-bold mb-2 uppercase tracking-widest text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Kết quả đề xuất
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2"
          >
            {result?.ten_nganh}
          </motion.h1>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-base-200/50 p-6 md:p-8 rounded-2xl text-left border border-base-300"
        >
          <p className="text-lg leading-relaxed mb-6">{result?.describe}</p>
          <div className="space-y-3">
            <h3 className="font-bold text-lg mb-4">Lý do đề xuất:</h3>
            <div className="flex items-start gap-3">
              <span className="text-base-content/80">
                {result?.ly_do_phu_hop}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="pt-6"
        >
          <button
            onClick={handleRestart}
            className="btn btn-outline btn-primary rounded-full px-8"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Bắt đầu lại
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
