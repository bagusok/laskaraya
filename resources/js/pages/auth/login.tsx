import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function Login() {
  const { data, setData, processing, post } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("login.post"), {
      onSuccess: (data) => {
        console.log(data.props);
        toast.success(data.props?.success);
      },
      onError: (error) => {
        console.log(error);
        Object.keys(error).forEach((key) => {
          toast.error(error[key]);
        });
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold">Login</h1>
      <form onSubmit={(e) => handleSubmit(e)} className="mt-4">
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded p-2 mb-4"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded p-2 mb-4"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-2">
          {processing ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
