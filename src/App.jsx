import { useState } from "react";
import "./App.css";
import { Header, Footer } from "../components/Template";
//Từ thư viện zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState("");
  const [errMs, setErrMs] = useState("");
  const handleInput = (e) => {
    const value = e.target.value;
    setScore(value);
    const numericScore = parseFloat(value);
    if (value === "") {
      setErrMs(""); //chuoi rong la nguoi dung chua nhap gi => khong co loi
    } else if (isNaN(numericScore) || numericScore > 10 || numericScore < 0) {
      setErrMs("Số không được vượt quá phạm vi từ 0 đến 10");
    } else {
      setErrMs(""); //diem hop le thi xoa thong bao loi
    }
  };
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen w-full">
          <span className="loading loading-spinner size-16"></span>
        </div>
      ) : (
        <>
          <Header />
          <div className="w-full min-h-screen flex justify-center items-center">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-3xl border p-4 ">
              <p className="text-2xl font-medium mb-3 text-center">
                Nhập điểm thi THPT của bạn
              </p>
              <div className="flex flex-row flex-warp justify-center items-start gap-5">
                <div className="w-auto">
                  <label className="label">Toán học</label>
                  <input
                    type="number"
                    step="0.01" //cho phep nhap so thap phan 2 chu so
                    className="input validator"
                    required
                    placeholder="Nhập số từ 0 to 10"
                    min="0"
                    max="10"
                    value={score}
                    onChange={handleInput}
                  />
                  <p className="validator-hint">{errMs}</p>
                  <label className="label">Ngữ văn</label>
                  <input
                    type="number"
                    step="0.01" //cho phep nhap so thap phan 2 chu so
                    className="input validator"
                    required
                    placeholder="Nhập số từ 0 to 10"
                    min="0"
                    max="10"
                    value={score}
                    onChange={handleInput}
                  />
                  <p className="validator-hint">{errMs}</p>
                </div>
                <div className="w-80">
                  <label className="label">Môn tự chọn 1</label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="email"
                      className="input"
                      placeholder="Ngữ Văn"
                    />
                    <input
                      type="number"
                      step="0.01" //cho phep nhap so thap phan 2 chu so
                      className="input validator"
                      required
                      placeholder="Nhập số từ 0 to 10"
                      min="0"
                      max="10"
                      value={score}
                      onChange={handleInput}
                    />
                  </div>
                  <p className="validator-hint">{errMs}</p>
                  <label className="label">Môn tự chọn 2</label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="email"
                      className="input"
                      placeholder="Ngữ Văn"
                    />
                    <input
                      type="number"
                      step="0.01" //cho phep nhap so thap phan 2 chu so
                      className="input validator"
                      required
                      placeholder="Nhập số từ 0 to 10"
                      min="0"
                      max="10"
                      value={score}
                      onChange={handleInput}
                    />
                  </div>

                  <p className="validator-hint">{errMs}</p>
                </div>
              </div>
            </fieldset>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
