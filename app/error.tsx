"use client";
import { Progress } from "@/components/ui/progress";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Error = () => {
  const [progress, setProgress] = useState(13);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(90);

      router.push("/dashboard/files");
    }, 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center space-y-6">
      <p>Algo de errado ocorreu, recarregando... </p>
      <Progress value={progress} className="w-[60%]" />
    </div>
  );
};

export default Error;
