import { Column } from "@/components/ui/column";
import { Row } from "@/components/ui/row";
import { Gallery } from "@/components/gallery";
import { InputForm } from "@/components/input-form";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
      <Navbar />
      <Column className="w-full items-center min-h-screen py-44">
        <Column className="w-full max-w-3xl lg:max-w-4xl xl:max-w-6xl">
          <InputForm />
          <Row className="my-24 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
          {/* <Gallery /> */}
        </Column>
      </Column>
    </div>
  );
}
