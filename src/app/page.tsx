import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-50 to-teal-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col mb-8 items-center text-center">
          <Image
            src="/traveller-connect-logo.png"
            height={80}
            width={80}
            alt="logo"
            className="mb-4"
          />
          <h1 className="text-3xl font-bold tracking-tight text-teal-700">
            Traveller Connect
          </h1>
          <p className="mt-2 text-sm text-teal-600">
            Your travel companion app
          </p>
        </div>

        <Card className="border-teal-200 backdrop-blur bg-white/80">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-teal-700">Welcome</CardTitle>
            <CardDescription>
              Signin to your account or create one
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
            >
              <Link href="/signup">Create Account</Link>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center text-muted-foreground text-xs">
            <p>By Continuing this you agree to our terms and services</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
