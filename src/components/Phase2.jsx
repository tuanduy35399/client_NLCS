import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Sparkles, Target, Cpu, Loader2 } from "lucide-react";
import { playClickSound } from "../utils/audio";

// Giả lập dữ liệu ML.NET trả về
// const MOCK_ML_RESULTS = [
//   { id: 1, name: "Nhóm ngành Máy tính & CNTT", match: 94, icon: Cpu, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500" },
//   { id: 2, name: "Nhóm ngành Kinh doanh & Quản lý", match: 82, icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500" },
//   { id: 3, name: "Nhóm ngành Mỹ thuật ứng dụng", match: 65, icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500" },
// ];

export default function Phase2({ prediction, onBack, onNext }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectGroup = (group) => {
    playClickSound();
    setSelectedGroup(group);
  };

  const handleSend = () => {
    if (!selectedGroup) return; // Prevent sending if no group selected
    if (!prompt.trim()) return;
    playClickSound();
    setIsLoading(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-base-100 rounded-3xl shadow-xl border border-base-200 flex flex-col min-h-[600px]"
    >
      <div className="flex items-center mb-8">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="btn btn-ghost btn-circle text-base-content/70 hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center pr-12">
          <h2 className="text-2xl font-bold text-primary">
            Phân Tích & Thu Hẹp Ngành Học
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Hệ thống AI ML.NET đề xuất các nhóm ngành phù hợp nhất
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        {/* ML Results Area */}
        <div className="space-y-4">
          <p className="font-medium text-lg flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              1
            </span>
            Chọn một nhóm ngành bạn quan tâm nhất:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prediction?.map((group, index) => {
              // const Icon = group.icon;
              const isSelected = selectedGroup?.index === index;

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectGroup(group)}
                  className={`
                    cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden
                    ${
                      isSelected
                        ? `bg-blue-500/10 shadow-lg border-blue-500`
                        : "border-base-200 hover:border-base-300 bg-base-100"
                    }
                  `}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-gradient-to-br from-transparent to-base-100/50 pointer-events-none"
                    />
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-2 rounded-xl bg-blue-500/10 text-blue-500`}
                    >
                      {/* <Icon className="w-6 h-6" /> */}
                    </div>
                    {/* <div className="badge badge-lg font-bold bg-base-100 shadow-sm">
                      {group.match}%
                    </div> */}
                  </div>

                  <h3 className="font-bold text-lg leading-tight mb-2">
                    {group.NhomNganh}
                  </h3>
                  <p className="text-xs text-base-content/60">
                    Độ tương thích dựa trên điểm số và Holland test
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {selectedGroup && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="flex-1 flex flex-col mt-4"
            >
              <div className="divider my-0"></div>
              <div className="flex-1 flex flex-col justify-end pt-6">
                <p className="font-medium text-lg flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                    2
                  </span>
                  Kể thêm về bạn để AI gợi ý chuyên ngành cụ thể:
                </p>

                {/* Chat Bubble / Input Area */}
                <div className="relative group">
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${isLoading ? "animate-pulse opacity-50" : ""}`}
                  ></div>
                  <div className="relative bg-base-100 rounded-3xl shadow-sm border border-base-200 p-2 flex items-end gap-2">
                    <textarea
                      className="textarea flex-1 min-h-[80px] max-h-[200px] border-none focus:outline-none resize-none bg-transparent text-base p-3"
                      placeholder={`Vui lòng mô tả chi tiết sở thích, tính cách hoặc mong muốn của bạn đối với ${selectedGroup.NhomNganh} để hệ thống gợi ý chuyên ngành cụ thể nhất...`}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                    ></textarea>

                    <button
                      onClick={handleSend}
                      disabled={!prompt.trim() || isLoading}
                      className={`btn btn-circle mb-1 mr-1 transition-all
                        ${
                          prompt.trim() && !isLoading
                            ? "bg-primary hover:bg-primary-focus text-white"
                            : "bg-base-200 text-base-content/30"
                        }
                      `}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5 -ml-1 mt-1" />
                      )}
                    </button>
                  </div>
                </div>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-6 text-base-content/60 flex items-center justify-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    AI đang phân tích và tìm kiếm chuyên ngành phù hợp nhất...
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
