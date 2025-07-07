import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { SigninValidation } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

// ✅ Define form type from Zod schema
type SigninValues = z.infer<typeof SigninValidation>;

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<SigninValues>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutateAsync: signInAccount,
    isPending: isSigningIn,
  } = useSignInAccount();

  const onSubmit = async (values: SigninValues) => {
    try {
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      // Optional wait to avoid session race condition
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isLoggedIn = await checkAuthUser();
      if (!isLoggedIn) throw new Error("Failed to verify login status");

      form.reset();
      navigate("/");
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Sign-in failed",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/Group-19.png" alt="logo" className="mb-[-8px]" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 text-white">Log-in to your account</h2>
        <p className="mt-1 text-white text-sm font-normal">
          Welcome back! Please enter your details
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
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
            {isSigningIn || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link to="/sign-up" className="text-red hover:text-red/80 text-sm font-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;






