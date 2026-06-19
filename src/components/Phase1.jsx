import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, GraduationCap, AlertCircle, HeartPulse, Brain } from 'lucide-react';
import { playClickSound } from '../utils/audio';

const OPTIONAL_SUBJECTS = [
  'Vật Lý', 'Hóa Học', 'Sinh Học', 'Lịch Sử', 'Địa Lý', 'Giáo Dục Công Dân'
];

export default function Phase1({ onNext, initialData }) {
  const [grades, setGrades] = useState(initialData?.grades || {
    math: '',
    literature: '',
    english: '',
    optional1: '',
    optional2: ''
  });
  const [selectedSubjects, setSelectedSubjects] = useState(initialData?.subjects || {
    opt1: '',
    opt2: ''
  });
  const [hollandCode, setHollandCode] = useState(initialData?.hollandCode || '');
  const [errors, setErrors] = useState({});

  const validateGrade = (val) => {
    if (val === '') return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 10;
  };

  const handleGradeChange = (subject, value) => {
    if (!validateGrade(value)) {
      setErrors({ ...errors, [subject]: 'Điểm phải từ 0 đến 10' });
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
    if (dropdown === 'opt1') handleGradeChange('optional1', '');
    if (dropdown === 'opt2') handleGradeChange('optional2', '');
  };

  const getAvailableSubjects = (currentDropdown) => {
    const otherDropdown = currentDropdown === 'opt1' ? selectedSubjects.opt2 : selectedSubjects.opt1;
    return OPTIONAL_SUBJECTS.filter(sub => sub !== otherDropdown);
  };

  const handleContinue = () => {
    playClickSound();
    // Validate everything
    const newErrors = {};
    Object.keys(grades).forEach(key => {
      if (!grades[key]) newErrors[key] = 'Vui lòng nhập điểm';
      else if (!validateGrade(grades[key])) newErrors[key] = 'Điểm không hợp lệ';
    });
    
    if (!selectedSubjects.opt1) newErrors.opt1 = 'Vui lòng chọn môn';
    if (!selectedSubjects.opt2) newErrors.opt2 = 'Vui lòng chọn môn';
    if (!hollandCode || hollandCode.length < 3) newErrors.holland = 'Vui lòng nhập mã Holland (ví dụ: RIA)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({ grades, subjects: selectedSubjects, hollandCode });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-base-100 rounded-3xl shadow-xl border border-base-200"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8" />
          Nhập Điểm & Tính Cách
        </h2>
        <p className="text-base-content/70">Bước 1: Cung cấp thông tin học tập và sở thích của bạn để chúng tôi phân tích</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Grades */}
        <div className="space-y-6">
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary">
              <GraduationCap className="w-5 h-5" />
              Điểm Học Tập
            </h3>
            
            <div className="space-y-4">
              {/* Mandatory Subjects */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'math', label: 'Toán' },
                  { id: 'literature', label: 'Văn' },
                  { id: 'english', label: 'Ngoại Ngữ' }
                ].map(sub => (
                  <div key={sub.id} className="form-control">
                    <label className="label py-1"><span className="label-text font-medium">{sub.label}</span></label>
                    <input 
                      type="number" 
                      min="0" max="10" step="0.1"
                      className={`input input-bordered w-full focus:outline-primary ${errors[sub.id] ? 'input-error' : ''}`}
                      value={grades[sub.id]}
                      onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                      placeholder="0-10"
                    />
                  </div>
                ))}
              </div>

              {/* Optional Subjects */}
              <div className="space-y-3 pt-2">
                <label className="label py-1"><span className="label-text font-medium">Môn tự chọn 1</span></label>
                <div className="flex gap-3">
                  <select 
                    className={`select select-bordered w-2/3 focus:outline-primary ${errors.opt1 ? 'select-error' : ''}`}
                    value={selectedSubjects.opt1}
                    onChange={(e) => handleSubjectChange('opt1', e.target.value)}
                  >
                    <option value="" disabled>Chọn môn học</option>
                    {getAvailableSubjects('opt1').map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                  <input 
                    type="number" 
                    min="0" max="10" step="0.1"
                    className={`input input-bordered w-1/3 focus:outline-primary ${errors.optional1 ? 'input-error' : ''}`}
                    value={grades.optional1}
                    onChange={(e) => handleGradeChange('optional1', e.target.value)}
                    placeholder="Điểm"
                    disabled={!selectedSubjects.opt1}
                  />
                </div>
                
                <label className="label py-1"><span className="label-text font-medium">Môn tự chọn 2</span></label>
                <div className="flex gap-3">
                  <select 
                    className={`select select-bordered w-2/3 focus:outline-primary ${errors.opt2 ? 'select-error' : ''}`}
                    value={selectedSubjects.opt2}
                    onChange={(e) => handleSubjectChange('opt2', e.target.value)}
                  >
                    <option value="" disabled>Chọn môn học</option>
                    {getAvailableSubjects('opt2').map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                  <input 
                    type="number" 
                    min="0" max="10" step="0.1"
                    className={`input input-bordered w-1/3 focus:outline-primary ${errors.optional2 ? 'input-error' : ''}`}
                    value={grades.optional2}
                    onChange={(e) => handleGradeChange('optional2', e.target.value)}
                    placeholder="Điểm"
                    disabled={!selectedSubjects.opt2}
                  />
                </div>
              </div>

              {/* Error summary */}
              {Object.keys(errors).some(k => k !== 'holland') && (
                <div className="text-error text-sm flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4" /> Vui lòng kiểm tra lại điểm số (0-10) và chọn đủ môn.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Holland Test */}
        <div className="space-y-6">
          <div className="bg-secondary/5 p-6 rounded-2xl border border-secondary/10 h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-secondary">
              <Brain className="w-5 h-5" />
              Trắc Nghiệm Holland
            </h3>
            
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div className="text-center p-6 bg-base-100 rounded-xl shadow-inner border border-base-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-accent"></div>
                <p className="mb-4 text-base-content/80">Khám phá nhóm tính cách của bạn để có gợi ý ngành nghề chính xác nhất.</p>
                
                <motion.a 
                  href="https://rightpath.edu.vn/trac-nghiem-ban-than/trac-nghiem-so-thich-holland"
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
                    ease: "easeInOut"
                  }}
                >
                  <HeartPulse className="w-5 h-5 mr-2 group-hover:animate-ping absolute opacity-50" />
                  <HeartPulse className="w-5 h-5 mr-2" />
                  Làm bài trắc nghiệm tại đây nhé!
                </motion.a>
                
                <p className="mt-4 text-xs text-base-content/50 leading-relaxed max-w-[90%] mx-auto">
                  Nguồn: https://rightpath.edu.vn/<br/>
                  Tác giả câu hỏi trắc nghiệm: Th.S Trần Thị Thúy Lan và C.N Lê Thị Hương Giang - Đại Học RMIT Việt Nam
                </p>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium text-base">Nhập mã Holland của bạn</span>
                  <span className="label-text-alt text-base-content/60">VD: RIA, SEC</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Nhập 3 chữ cái..." 
                  className={`input input-bordered w-full uppercase focus:outline-secondary ${errors.holland ? 'input-error' : ''}`}
                  value={hollandCode}
                  onChange={(e) => setHollandCode(e.target.value.toUpperCase().replace(/[^a-zA-Z]/g, '').slice(0, 3))}
                  maxLength={3}
                />
                {errors.holland && <span className="text-error text-sm mt-1">{errors.holland}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button 
          onClick={handleContinue}
          className="btn btn-primary px-8 text-white group rounded-full"
        >
          Tiếp tục
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
