import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  AlertCircle,
  Brain,
} from "lucide-react";
import { playClickSound } from "../utils/audio";
import axios from "axios";

//Danh sach cac mon hien thi tren dropdown list
const OPTIONAL_SUBJECTS = [
  "Vật Lý",
  "Hóa Học",
  "Sinh Học",
  "Lịch Sử",
  "Địa Lý",
  "Ngoại Ngữ",
  "Giáo dục kinh tế và pháp luật",
  "Công nghệ công nghiệp",
  "Công nghệ nông nghiệp",
];
// Anh xa qua khi goi API Backend
const SUBJECT_MAP = {
  "Toán": "Toan",
  "Ngữ Văn": "Ngu van",
  "Vật Lý": "Vat li",
  "Hóa Học": "Hoa hoc",
  "Sinh Học": "Sinh hoc",
  "Lịch Sử": "Lich su",
  "Địa Lý": "Dia li",
  "Ngoại Ngữ": "Tieng Anh",
  "Giáo dục kinh tế và pháp luật": "Giao duc cong dan",
  "Công nghệ công nghiệp": "Cong nghe cong nghiep",
  "Công nghệ nông nghiệp": "Cong nghe nong nghiep",
};

export default function Phase1({ onNext, initialData }) {
  const [grades, setGrades] = useState(
    initialData?.grades || {
      math: "",
      literature: "",
      optional1: "",
      optional2: "",
    },
  );
  const [selectedSubjects, setSelectedSubjects] = useState(
    initialData?.subjects || {
      opt1: "",
      opt2: "",
    },
  );
  const [hollandCode, setHollandCode] = useState(
    initialData?.hollandCode || "",
  );
  const [errors, setErrors] = useState({});
  const subjects = [
    "Toan",
    "Ngu van",
    SUBJECT_MAP[selectedSubjects.opt1],
    SUBJECT_MAP[selectedSubjects.opt2],
  ];
  const scores = {
    [SUBJECT_MAP["Toán"]]: Number(grades.math),
    [SUBJECT_MAP["Ngữ Văn"]]: Number(grades.literature),
    [SUBJECT_MAP[selectedSubjects.opt1]]: Number(grades.optional1),
    [SUBJECT_MAP[selectedSubjects.opt2]]: Number(grades.optional2),
  };
  const validateGrade = (val) => {
    if (val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 10;
  };

  const handleGradeChange = (subject, value) => {
    if (!validateGrade(value)) {
      setErrors({ ...errors, [subject]: "Điểm phải từ 0 đến 10" });
    } else {
      const newErrors = { ...errors };
      delete newErrors[subject];
      setErrors(newErrors);
    }
    setGrades({ ...grades, [subject]: value });
  };

  const handleSubjectChange = (dropdown, value) => {
    playClickSound();
    setSelectedSubjects({ ...selectedSubjects, [dropdown]: value });
    // Reset grade if subject changed
    if (dropdown === "opt1") handleGradeChange("optional1", "");
    if (dropdown === "opt2") handleGradeChange("optional2", "");
  };

  const getAvailableSubjects = (currentDropdown) => {
    const otherDropdown =
      currentDropdown === "opt1"
        ? selectedSubjects.opt2
        : selectedSubjects.opt1;
    return OPTIONAL_SUBJECTS.filter((sub) => sub !== otherDropdown);
  };

  const predict_api = async (data_user) => {
    const res = await axios.post("http://127.0.0.1:8000/predict/", data_user);
    return res.data;
  };
  const handleContinue = async () => {
    playClickSound();
    // Xu ly loi
    const newErrors = {};
    Object.keys(grades).forEach((key) => {
      if (!grades[key]) newErrors[key] = "Vui lòng nhập điểm";
      else if (!validateGrade(grades[key]))
        newErrors[key] = "Điểm không hợp lệ";
    });

    if (!selectedSubjects.opt1) newErrors.opt1 = "Vui lòng chọn môn";
    if (!selectedSubjects.opt2) newErrors.opt2 = "Vui lòng chọn môn";
    if (!hollandCode || hollandCode.length > 1)
      newErrors.holland = "Vui lòng nhập mã viết tắt Holland (ví dụ: R hoặc I)";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const data_user = {
      subjects,
      scores,
      holland: hollandCode,
    };
    console.log(data_user);
    //Goi API du doan tu ML PhanLop
    const kq = await predict_api(data_user);
    console.log("Ket qua du doan: \n", kq);
    onNext({
      prediction: kq.recommendations,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-base-100 rounded-xl shadow-xl border border-base-200"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          {/* <BookOpen className="w-8 h-8" /> */}
          Nhập Điểm và Tính Cách
        </h2>
        <p className="text-base-content/70">
          Bước 1: Cung cấp thông tin học tập và sở thích của bạn để chúng tôi
          phân tích
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Grades */}
        <div className="space-y-6">
          <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary">
              {/* <GraduationCap className="w-5 h-5" /> */}
              Điểm Học Tập
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "math", label: "Toán" },
                  { id: "literature", label: "Văn" },
                ].map((sub) => (
                  <div key={sub.id} className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium">
                        {sub.label}
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      className={`input input-bordered w-full focus:outline-primary ${errors[sub.id] ? "input-error" : ""}`}
                      value={grades[sub.id]}
                      onChange={(e) =>
                        handleGradeChange(sub.id, e.target.value)
                      }
                      placeholder="0-10"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <label className="label py-1">
                  <span className="label-text font-medium">Môn tự chọn 1</span>
                </label>
                <div className="flex gap-3">
                  <select
                    className={`select select-bordered w-2/3 focus:outline-primary ${errors.opt1 ? "select-error" : ""}`}
                    value={selectedSubjects.opt1}
                    onChange={(e) =>
                      handleSubjectChange("opt1", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Chọn môn học
                    </option>
                    {getAvailableSubjects("opt1").map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    className={`input input-bordered w-1/3 focus:outline-primary ${errors.optional1 ? "input-error" : ""}`}
                    value={grades.optional1}
                    onChange={(e) =>
                      handleGradeChange("optional1", e.target.value)
                    }
                    placeholder="Điểm"
                    disabled={!selectedSubjects.opt1}
                  />
                </div>

                <label className="label py-1">
                  <span className="label-text font-medium">Môn tự chọn 2</span>
                </label>
                <div className="flex gap-3">
                  <select
                    className={`select select-bordered w-2/3 focus:outline-primary ${errors.opt2 ? "select-error" : ""}`}
                    value={selectedSubjects.opt2}
                    onChange={(e) =>
                      handleSubjectChange("opt2", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Chọn môn học
                    </option>
                    {getAvailableSubjects("opt2").map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    className={`input input-bordered w-1/3 focus:outline-primary ${errors.optional2 ? "input-error" : ""}`}
                    value={grades.optional2}
                    onChange={(e) =>
                      handleGradeChange("optional2", e.target.value)
                    }
                    placeholder="Điểm"
                    disabled={!selectedSubjects.opt2}
                  />
                </div>
              </div>

              {Object.keys(errors).some((k) => k !== "holland") && (
                <div className="text-error text-sm flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4" /> Vui lòng kiểm tra lại điểm
                  số (0-10) và chọn đủ môn.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/5 p-6 rounded-xl border border-secondary/10 h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-secondary">
              {/* <Brain className="w-5 h-5" /> */}
              Trắc Nghiệm Holland
            </h3>

            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div className="text-center p-6 bg-base-100 rounded-xl shadow-inner border border-base-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-accent"></div>
                <p className="mb-4 text-base-content/80">
                  Khám phá nhóm tính cách của bạn để có gợi ý ngành nghề chính
                  xác nhất.
                </p>

                <motion.a
                  href="https://unipath.vn/trac-nghiem-holland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-white group relative inline-flex"
                  onClick={playClickSound}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* <HeartPulse className="w-5 h-5 mr-2 group-hover:animate-ping absolute opacity-50" />
                  <HeartPulse className="w-5 h-5 mr-2" /> */}
                  Làm bài trắc nghiệm tại đây nha!
                </motion.a>

                <p className="mt-4 text-xs text-base-content/50 leading-relaxed max-w-[90%] mx-auto">
                  Nguồn: unipath.vn
                  <br />
                  Tác giả: Nguyễn Hoài Thi
                </p>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium text-base">
                    Nhập mã Holland của bạn
                  </span>
                  <span className="label-text-alt text-base-content/60">
                    VD: R hoặc I
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập 1 chữ cái..."
                  className={`input input-bordered w-full uppercase focus:outline-secondary ${errors.holland ? "input-error" : ""}`}
                  value={hollandCode}
                  onChange={(e) =>
                    setHollandCode(
                      e.target.value
                        .toUpperCase()
                        .replace(/[^a-zA-Z]/g, "")
                        .slice(0, 1),
                    )
                  }
                  maxLength={3}
                />
                {errors.holland && (
                  <span className="text-error text-sm mt-1">
                    {errors.holland}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button
          onClick={handleContinue}
          className="btn btn-primary px-8 text-white group rounded-l"
        >
          Tiếp tục
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
