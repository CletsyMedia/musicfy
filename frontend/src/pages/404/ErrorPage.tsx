import { Home, ArrowLeft, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
  errorCode?: string;
  errorMessage?: string;
  customMessage?: string;
  icon?: React.ComponentType<{ className?: string }>;
  showButtons?: ("goBack" | "home")[]; // Specify which buttons to show
}

export default function ErrorPage({
  errorCode = "404",
  errorMessage = "Page not found",
  customMessage = "Looks like this track got lost in the shuffle. Let's get you back to the music.",
  icon: Icon = Music2,
  showButtons = ["goBack", "home"],
}: ErrorPageProps) {
  const navigate = useNavigate();

  const buttons = [
    {
      key: "goBack",
      label: "Go Back",
      onClick: () => navigate(-1),
      variant: "outline" as "outline",
      className:
        "bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 w-full sm:w-auto",
      icon: ArrowLeft,
    },
    {
      key: "home",
      label: "Back to Home",
      onClick: () => navigate("/"),
      className:
        "bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto",
      icon: Home,
    },
  ];

  // Filter buttons based on `showButtons` prop
  const filteredButtons = buttons.filter((button) =>
    showButtons.includes(button.key as "goBack" | "home")
  );

  return (
    <div className="h-screen bg-neutral-900 flex items-center justify-center">
      <div className="text-center space-y-8 px-4">
        <div className="flex justify-center animate-bounce">
          <Icon className="h-24 w-24 text-emerald-500" />
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl font-bold text-white">{errorCode}</h1>
          <h2 className="text-2xl font-semibold text-white">{errorMessage}</h2>
          <p className="text-neutral-400 max-w-md mx-auto">{customMessage}</p>
        </div>
        {filteredButtons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            {filteredButtons.map((button) => (
              <Button
                key={button.key}
                onClick={button.onClick}
                variant={button.variant}
                className={button.className}
              >
                {button.icon && <button.icon className="mr-2 h-4 w-4" />}
                {button.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
