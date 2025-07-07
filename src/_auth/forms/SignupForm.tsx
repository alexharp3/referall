import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";

// ✅ Define form data type from Zod schema
type SignupValues = z.infer<typeof SignupValidation>;

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<SignupValues>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  const onSubmit = async (values: SignupValues) => {
    try {
      const newUser = await createUserAccount(values);
      if (!newUser) throw new Error("Account creation failed");

      await signInAccount({
        email: values.email,
        password: values.password,
      });

      // Optional delay to ensure session initialization
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        navigate("/");
      } else {
        throw new Error("Login verification failed after signup");
      }
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Signup failed",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/Group-19.png" alt="logo" className="mb-[-8px]" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 text-white">Create a new account</h2>
        <p className="mt-1 text-white text-sm font-normal">
          To use Refer-All, please enter your account details
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="text-white placeholder-gray-400 bg-transparent border-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="text-white placeholder-gray-400 bg-transparent border-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    className="text-white placeholder-gray-400 bg-transparent border-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="text-white placeholder-gray-400 bg-transparent border-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-red text-white hover:bg-red/80">
            {isCreatingUser || isSigningIn || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-red hover:text-red/80 text-sm font-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;



