import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, useForm } from "@inertiajs/react";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Register() {
  const [passwordVisible, setPasswordVisible] = useState(true);

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    identifier: "",
    phone: "",
    faculty: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("register.post"), {
      onSuccess: (data) => {
        console.log(data);
        toast.success("Berhasil mendaftar, silahkan login!");
      },
      onError: (error) => {
        Object.keys(error).forEach((key) => {
          toast.error(error[key]);
        });
      },
    });
  };

  return (
    <>
      <Head>
        <title>Daftar</title>
        <meta name="description" content="Daftar ke aplikasi" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="container mx-auto min-h-dvh flex flex-col items-center justify-center py-2">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-center text-3xl font-bold">Daftar</h1>
          <p className="text-sm text-slate-400 text-center font-light">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
            veniam itaque corrupti porro eveniet, quaerat labore aliquam iure
            rem deserunt?
          </p>
        </div>

        <form
          onSubmit={(e) => handleSubmit(e)}
          className="w-full max-w-sm mt-4 space-y-4"
        >
          <div className="form-group">
            <Label className="text-sm">Nama</Label>
            <Input
              type="text"
              name="name"
              placeholder="Joko"
              min={3}
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />
            {errors.name && (
              <small className="text-xs text-red-500">{errors.name}</small>
            )}
          </div>
          <div className="form-group">
            <Label className="text-sm">NIM</Label>
            <Input
              type="number"
              name="identifier"
              min={6}
              placeholder="234172xx"
              value={data.identifier}
              onChange={(e) => setData("identifier", e.target.value)}
            />
            {errors.identifier && (
              <small className="text-xs text-red-500">
                {errors.identifier}
              </small>
            )}
          </div>
          <div className="form-group">
            <Label className="text-sm">Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="joko@polinema.ac.id"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
            />
            {errors.email && (
              <small className="text-xs text-red-500">{errors.email}</small>
            )}
          </div>
          <div className="form-group">
            <Label className="text-sm">No. Hp</Label>
            <Input
              type="tel"
              name="phone"
              placeholder="08123456789"
              value={data.phone}
              onChange={(e) => setData("phone", e.target.value)}
            />
            {errors.phone && (
              <small className="text-xs text-red-500">{errors.phone}</small>
            )}
          </div>
          <div className="form-group">
            <Label className="text-sm">Fakultas</Label>
            <Input
              type="text"
              name="faculty"
              placeholder="Teknologi Informasi"
              value={data.faculty}
              onChange={(e) => setData("faculty", e.target.value)}
            />
            {errors.faculty && (
              <small className="text-xs text-red-500">{errors.faculty}</small>
            )}
          </div>
          <div className="form-group">
            <Label className="text-sm">Password</Label>
            <div className="w-full h-fit relative">
              <Input
                type={passwordVisible ? "password" : "text"}
                name="password"
                min={8}
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="absolute right-2 top-2 hover:opacity-80 transition-opacity duration-200 ease-in-out cursor-pointer"
              >
                {passwordVisible ? <EyeClosed size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <small className="text-xs text-red-500">{errors.password}</small>
            )}
          </div>
          <Button
            type="submit"
            className="w-full mt-4 disabled:opacity-75"
            disabled={processing}
          >
            {processing ? "Loading..." : "Daftar"}
          </Button>
        </form>
      </main>
    </>
  );
}
