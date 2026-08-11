import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Loader2, Check } from "lucide-react";
import { playClickSound } from "../utils/audio";

// Giả lập dữ liệu ML.NET trả về
// const MOCK_ML_RESULTS = [
//   { id: 1, name: "Nhóm ngành Máy tính & CNTT", match: 94, icon: Cpu, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500" },
//   { id: 2, name: "Nhóm ngành Kinh doanh & Quản lý", match: 82, icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500" },
//   { id: 3, name: "Nhóm ngành Mỹ thuật ứng dụng", match: 65, icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500" },
// ];
const Mapping = {
  GiaoDucMamNon: "Giáo dục Mầm non",
  GiaoDucTieuHoc: "Giáo dục Tiểu học",
  GiaoDucCongDan: "Giáo dục Công dân",
  GiaoDucTheChat: "Giáo dục Thể chất",
  SuPhamToanHoc: "Sư phạm Toán học",
  SuPhamTinHoc: "Sư phạm Tin học",
  SuPhamVatLy: "Sư phạm Vật lý",
  SuPhamHoaHoc: "Sư phạm Hóa học",
  SuPhamSinhHoc: "Sư phạm Sinh học",
  SuPhamNguVan: "Sư phạm Ngữ văn",
  SuPhamLichSu: "Sư phạm Lịch sử",
  SuPhamDiaLy: "Sư phạm Địa lý",
  SuPhamTiengAnh: "Sư phạm Tiếng Anh",
  SuPhamTiengPhap: "Sư phạm Tiếng Pháp",
  SuPhamKhoaHocTuNhien: "Sư phạm Khoa học tự nhiên",
  SuPhamLichSuDiaLy: "Sư phạm Lịch sử - Địa lý",
  KyThuat_CongNghe: "Kỹ thuật - Công nghệ và Kiến trúc - Xây dựng",
  NongNghiep_MoiTruong_ThuySan: "Nông nghiệp - Môi trường - Thủy Sản",
  KhoaHocTuNhien: "Khoa học tự nhiên",
  XaHoiNhanVan: "Khoa học Xã hội và Nhân văn",
  Luat_KinhTe: "Luật - Kinh tế",
  CongNgheThongTin_TruyenThong: "Công nghệ thông tin và Truyền thông",
  NgoaiNgu: "Ngoại ngữ",
};

const SUBJECT_LABELS = {
  Toan: "Toán",
  "Ngu van": "Ngữ văn",
  "Vat li": "Vật lí",
  "Hoa hoc": "Hóa học",
  "Sinh hoc": "Sinh học",
  "Lich su": "Lịch sử",
  "Dia li": "Địa lí",
  "Tieng Anh": "Tiếng Anh",
  "Tieng Phap": "Tiếng Pháp",
  "Tin hoc": "Tin học",
  "Giao duc cong dan": "Giáo dục kinh tế và pháp luật",
  "Giao duc KT&PL": "Giáo dục kinh tế và pháp luật",
  "Cong nghe cong nghiep": "Công nghệ công nghiệp",
  "Cong nghe nong nghiep": "Công nghệ nông nghiệp",
  "Nang khieu GDMN": "Năng khiếu giáo dục mầm non",
  "Nang khieu TDTT": "Năng khiếu thể dục thể thao",
  "Ve my thuat": "Vẽ mỹ thuật",
};

const getSubjectLabel = (subject) => SUBJECT_LABELS[subject] || subject;
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

    try {
      const userData2 = {
        selectedGroup,
        prompt,
      };
      // console.log(data);
      onNext(userData2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  //Them tab cho user de nhin hon
  const [activeTab, setActiveTab] = useState(0);
  const currentGroup = prediction?.[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-base-100 rounded-xl shadow-xl border border-base-200 flex flex-col min-h-[600px]"
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
            Hệ thống AI đề xuất các nhóm ngành phù hợp nhất
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <div className="space-y-4">
          <p className="font-medium text-lg flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              1
            </span>
            Chọn một nhóm ngành bạn quan tâm nhất:
          </p>
          <div className="flex gap-3 mb-6 flex-wrap">
            {prediction?.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`
                      px-5 py-2 rounded-xl font-semibold transition-all duration-300 shadow-sm
                      ${
                        activeTab === index
                          ? "bg-blue-600 text-white shadow-lg scale-105"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }
                    `}
              >
                {item.MaToHop}
              </button>
            ))}
          </div>
          <div className="mb-3 text-xl text-gray-500">
            Điểm tổ hợp: <b>{currentGroup?.DiemToHop}</b>
          </div>
          {currentGroup?.MonHoc?.length > 0 && (
            <div className="mb-5 rounded-xl border border-primary/15 bg-primary/5 p-4">
              <p className="mb-2 text-sm font-semibold text-base-content/70">
                Tổ hợp {currentGroup.MaToHop} gồm các môn:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentGroup.MonHoc.map((subject) => (
                  <span key={subject} className="badge badge-primary badge-outline px-3 py-3">
                    {getSubjectLabel(subject)}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentGroup?.Top3.filter((item) => item.XacSuat > 0).map(
              (element, index) => {
                const isSelected =
                  selectedGroup?.NhomNganh === element.NhomNganh;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectGroup(element)}
                    className={`
                cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 relative overflow-hidden
                ${
                  isSelected
                    ? "bg-blue-500/10 shadow-lg border-blue-500"
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
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                        {isSelected ? <Check className="w-5 h-5" /> : ""}
                      </div>

                      <div className="badge badge-lg font-bold bg-base-100 shadow-sm">
                        {(element.XacSuat * 100).toFixed(2)}%
                      </div>
                    </div>

                    <h3 className="font-bold text-lg">
                      {Mapping[element.NhomNganh]}
                    </h3>

                    <p className="text-xs text-base-content/60">
                      Độ tương thích dựa trên điểm số và Holland test
                    </p>
                  </motion.div>
                );
              },
            )}
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
                    <span className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                      2
                    </span>
                    Kể thêm về bạn để AI gợi ý chuyên ngành cụ thể:
                  </p>

                  {/* Chat Bubble / Input Area */}
                  <div className="relative group">
                    <div
                      className={`absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${isLoading ? "animate-pulse opacity-50" : ""}`}
                    ></div>
                    <div className="relative bg-base-100 rounded-xl shadow-sm border border-base-200 p-2 flex items-end gap-2">
                      <textarea
                        className="textarea flex-1 min-h-[80px] max-h-[200px] border-none focus:outline-none resize-none bg-transparent text-base p-3"
                        placeholder={`Vui lòng mô tả chi tiết sở thích, tính cách hoặc mong muốn của bạn đối với ${Mapping[selectedGroup.NhomNganh]} để hệ thống gợi ý chuyên ngành cụ thể nhất...`}
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
      </div>
    </motion.div>
  );
}
