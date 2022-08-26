import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/auth_context";
import useDocumentTitle from "../hooks/use_document_title";
import Spinner from "../components/spinner";
import { getErrorMessages } from "../lib/errors";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must have minimum of 8 characters" }),
});

type FormData = z.infer<typeof formSchema>;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("BetterNotes | Login");

  const { register, handleSubmit, formState, setError } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Adding server error to errors type
  type ErrorsType = typeof formState.errors & { server?: { message: string } };

  // not using destruring since it is easier to type errors without it
  // eslint-disable-next-line prefer-destructuring
  const errors: ErrorsType = formState.errors;
  const { isSubmitting } = formState;

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      navigate("/", { replace: true });
    } catch (e) {
      const serverErrors = await getErrorMessages(e as Error);
      serverErrors.forEach((error) => setError(error.name, error));
    }
  };

  return (
    <main className="bg-gray-1 min-h-screen">
      <header className="p-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">BetterNotes</h1>
        <Link
          to="/sign_up"
          className="border rounded-lg border-primary text-primary px-4 py-2 hover:bg-primary hover:text-on-primary"
        >
          Sign up
        </Link>
      </header>

      <section className="max-w-md w-11/12 p-6 mt-4 mx-auto bg-bg rounded-xl">
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
            {errors.email && (
              <small role="alert" className="form-error">
                {errors.email.message}
              </small>
            )}
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
              <small role="alert" className="form-error">
                {errors.password.message}
              </small>
            )}
          </div>
          {errors.server && (
            <small role="alert" className="form-error">
              {errors.server.message}
            </small>
          )}

          <button
            type="submit"
            className="form-submit-btn hover:bg-primary/70"
            disabled={isSubmitting}
          >
            <span className="mr-4">Sign in</span>
            <Spinner isVisible={isSubmitting} />
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
