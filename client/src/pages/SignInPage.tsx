import { SignInForm } from "@/components/forms/signIn-form";
import { Shell } from "@/components/shells/shell";
import { Card, CardContent } from "@/components/ui/card";
import image from "@/assets/agrimap.png";

function SignInPage() {
  return (
    <Shell>
      <div className="container min-h-screen flex justify-center items-center">
        <Card className="py-10">
          <CardContent className="grid gap-4">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex justify-center">
                <div>
                  <img className="h-32" src={image} alt="logo" />
                </div>
              </div>
              <span className="w-full border-t" />
            </div>
            <SignInForm />
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}

export default SignInPage;