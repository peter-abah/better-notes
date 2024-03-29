import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../contexts/auth_context";
import useDocumentTitle from "../hooks/use_document_title";
import Spinner from "../components/spinner";
import { getErrorMessages } from "../lib/errors";

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Enter email address" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must have minimum of 8 characters" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof formSchema>;

function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("BetterNotes | Sign up");

  const { register, handleSubmit, formState, setError } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Add server errors to errors type
  type ErrorsType = typeof formState.errors & { server?: { message: string } };
  // eslint-disable-next-line prefer-destructuring
  const errors: ErrorsType = formState.errors;
  const { isSubmitting } = formState;

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
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
          to="/sign_in"
          className="border rounded-md border-primary px-3 py-2 hover:bg-primary hover:text-on-primary"
        >
          Sign in
        </Link>
      </header>

      <section className="max-w-md w-11/12 p-6 mt-4 mx-auto bg-bg rounded-xl">
        <h1 className="mb-8 text-center text-3xl font-bold">New account</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-field">
            <label htmlFor="email" className="mb-2">
              Your email address
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

          <div className="form-field">
            <label htmlFor="password_confirmation" className="mb-2">
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              className="form-input"
              type="password"
              {...register("password_confirmation")}
            />
            {errors.password_confirmation && (
              <small role="alert" className="form-error">
                {errors.password_confirmation.message}
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
            <span className="mr-4">Sign up</span>
            <Spinner isVisible={isSubmitting} />
          </button>
        </form>
      </section>
    </main>
  );
}

export default Register;
