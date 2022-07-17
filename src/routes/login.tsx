import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import "./form.css";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must have minimum of 8 characters" }),
});

type FormData = z.infer<typeof formSchema>;

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: any) => {
    alert(JSON.stringify(data));
  };

  return (
    <main className="bg-neutral-100 min-h-screen">
      <header className="p-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">BetterNotes</h1>
        <Link
          to="/sign_up"
          className="border rounded-md border-black px-3 py-2"
        >
          Sign up
        </Link>
      </header>

      <section className="max-w-md w-11/12 p-6 mt-4 mx-auto bg-white rounded-xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-field">
            <label htmlFor="email" className="mb-2">
              Email address
            </label>
            <input
              id="email"
              className="form-input"
              type="email"
              {...register("email")}
            />
            {errors.email && <small role="alert">{errors.email.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="password" className="mb-2">
              Password
            </label>
            <input
              id="password"
              className="form-input"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <small role="alert">{errors.password.message}</small>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
