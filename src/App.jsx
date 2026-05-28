import { useState } from "react";
import "./App.css";
import { Header, Footer } from "../components/Template";
//Từ thư viện zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

//Dinh nghia schema
//Moi o input se duoc quy dinh kiem tra
const scoreFormSchema = z.object({
  math: z
    .string()
    .min(1, { message: "Vui lòng nhập điểm Toán" })
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 10;
      },
      { message: "Điểm Toán phải nằm trong phạm vi từ 0 đến 10" },
    ),

  literature: z
    .string()
    .min(1, { message: "Vui lòng nhập điểm Văn" })
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 10;
      },
      { message: "Điểm Văn phải nằm trong phạm vi từ 0 đến 10" },
    ),

  thirdSubject: z
    .string()
    .min(1, { message: "Vui lòng nhập điểm môn thứ ba" })
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 10;
      },
      { message: "Điểm số phải nằm trong phạm vi từ 0 đến 10" },
    ),

  fourthSubject: z
    .string()
    .min(1, { message: "Vui lòng nhập điểm môn thứ ba" })
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 10;
      },
      { message: "Điểm số phải nằm trong phạm vi từ 0 đến 10" },
    ),
});
function App() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(scoreFormSchema),
    mode: "onChange", // Kiểm tra lỗi real-time ngay khi người dùng gõ phím
  });

  const onSubmit = (data) => {
    console.log("Dữ liệu form hợp lệ gửi lên:", data);
    //Call API
  };

  return (
    <div>
      <div
        style={{
          background: "white",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)`,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen w-full">
            <span className="loading loading-spinner size-16"></span>
          </div>
        ) : (
          <>
            <Header />
            <div className="w-full min-h-screen flex justify-center items-center ">
              <form className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4 ">
                <p className="text-2xl font-medium mb-3 text-center">
                  Nhập điểm thi THPT của bạn
                </p>
                <div className="flex flex-row justify-center items-start gap-5">
                  {/* Cot 1 */}
                  <div className="w-45 flex flex-col gap-4">
                    <div>
                      <label className="label">Toán học</label>
                      <input
                        type="number"
                        step="0.01" //cho phep nhap so thap phan 2 chu so
                        className={`input input-bordered w-full ${errors.math ? "input-error" : ""}`}
                        {...register("math")}
                        placeholder="Nhập số từ 0 to 10"
                      />
                      {errors.math && (
                        <p className="text-error text-xs mt-1">
                          {errors.math.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="label">Ngữ văn</label>
                      <input
                        type="number"
                        step="0.01" //cho phep nhap so thap phan 2 chu so
                        className={`input input-bordered w-full ${errors.literature ? "input-error" : ""}`}
                        {...register("literature")}
                        placeholder="Nhập số từ 0 to 10"
                      />
                      {errors.literature && (
                        <p className="text-error text-xs mt-1">
                          {errors.literature.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Cot 2 */}
                  <div className="w-80 flex flex-col gap-4">
                    <div>
                      <label className="label">Môn tự chọn 1</label>
                      <div className="flex flex-row gap-2">
                        <label class="select">
                          <select>
                            <option>Vật Lý</option>
                            <option>Hóa Học</option>
                          </select>
                        </label>
                        <input
                          type="number"
                          step="0.01" //cho phep nhap so thap phan 2 chu so
                          className={`input input-bordered w-full ${errors.thirdSubject ? "input-error" : ""}`}
                          {...register("thirdSubject")}
                          placeholder="Nhập số từ 0 to 10"
                        />
                      </div>
                      {errors.thirdSubject && (
                        <p className="text-error text-xs mt-1">
                          {errors.thirdSubject.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="label">Môn tự chọn 2</label>
                      <div className="flex flex-row gap-2">
                        <label class="select">
                          <select>
                            <option>Vật Lý</option>
                            <option>Hóa Học</option>
                          </select>
                        </label>
                        <input
                          type="number"
                          step="0.01" //cho phep nhap so thap phan 2 chu so
                          className={`input input-bordered w-full ${errors.fourthSubject ? "input-error" : ""}`}
                          {...register("fourthSubject")}
                          placeholder="Nhập số từ 0 to 10"
                        />
                      </div>
                      {errors.fourthSubject && (
                        <p className="text-error text-xs mt-1">
                          {errors.fourthSubject.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-neutral mt-4 w-full"
                  disabled={!isValid}
                >
                  Gửi dữ liệu điểm
                </button>
              </form>
            </div>
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
