import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Row } from "./ui/row";
import { Slider } from "./ui/slider";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export const Parameters = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col gap-6 items-center justify-center bg-slate-50 bg-opacity-30 px-5 pt-5 py-6 rounded-lg border border-slate-200 border-opacity-50">
        <Label htmlFor="image-size">Image Size</Label>
        <div className="relative flex flex-col items-center p-4">
          {/* Landscape */}
          <div className="relative border-2 border-dashed border-gray-200 p-4 w-36 h-24 flex items-center justify-center rounded-lg" />
          {/* Portrait */}
          <div className="absolute border-2 w-24 h-32 border-gray-700 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-4 rounded-lg" />
        </div>
        <Row className="my-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
        <div className="flex items-center justify-between space-x-6">
          <ToggleGroup
            type="single"
            className="flex items-center justify-center gap-3"
            variant="pill"
            value="portrait"
          >
            <ToggleGroupItem
              className="data-[state=on]:bg-gray-800 data-[state=on]:text-white bg-slate-100 text-slate-500"
              value="portrait"
              aria-label="Toggle anime"
            >
              Portrait
            </ToggleGroupItem>
            <ToggleGroupItem
              className="data-[state=on]:bg-gray-800 data-[state=on]:text-white bg-slate-100 text-slate-500"
              value="square"
              aria-label="Toggle realism"
            >
              Square
            </ToggleGroupItem>
            <ToggleGroupItem
              className="data-[state=on]:bg-gray-800 data-[state=on]:text-white bg-slate-100 text-slate-500"
              value="landscape"
              aria-label="Toggle 3D"
            >
              Landscape
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div className="flex flex-col gap-6 items-center justify-center bg-slate-50 bg-opacity-30 px-5 pt-5 py-6 rounded-lg border border-slate-200 border-opacity-50">
        <Label htmlFor="aesthetics">Settings</Label>
        <div className="grid w-full h-full">
          <div className="flex items-center justify-between space-x-6 py-2">
            <Label htmlFor="stylization" className="font-normal">
              Stylization
            </Label>
            <Slider
              className="w-[60%]"
              defaultValue={[33]}
              max={100}
              step={1}
            />
          </div>
          <Row className="my-6 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
          <div className="flex items-center justify-between space-x-6 py-2">
            <div className="flex items-center space-x-6">
              <Label htmlFor="weirdness" className="font-normal">
                Weirdness
              </Label>
            </div>
            <Slider
              className="w-[60%]"
              defaultValue={[33]}
              max={100}
              step={1}
            />
          </div>
          <Row className="my-6 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
          <div className="flex items-center justify-between space-x-6 py-2">
            <Label htmlFor="Variety" className="font-normal">
              Variety
            </Label>
            <Slider
              className="w-[60%]"
              defaultValue={[33]}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col h-fit gap-6 items-center justify-center bg-slate-50 bg-opacity-30 px-5 pt-5 py-6 rounded-lg border border-slate-200 border-opacity-50">
          <Label htmlFor="model">Aesthetics</Label>
          <div className="grid w-full">
            <div className="flex items-center justify-between space-x-6">
              <Label htmlFor="Style" className="font-normal">
                Style
              </Label>
              <ToggleGroup
                type="single"
                variant="pill"
                value="digital"
                className="flex gap-1"
              >
                <ToggleGroupItem
                  value="digital"
                  aria-label="Toggle digital"
                  size={"sm"}
                  className="font-light gap-2 data-[state=on]:bg-gray-800 data-[state=on]:text-white bg-slate-100 text-slate-500"
                >
                  Digital
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="realism"
                  aria-label="Toggle realism"
                  size={"sm"}
                  className="font-light data-[state=on]:bg-gray-800 data-[state=on]:text-white bg-slate-100 text-slate-500"
                >
                  Realism
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="anime"
                  aria-label="Toggle anime"
                  size={"sm"}
                  className="font-light data-[state=on]:bg-gray-800 data-[state=on]:text-white bg-slate-100 text-slate-500"
                >
                  Anime
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Row className="my-6 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
            <div className="flex items-center justify-between space-x-6">
              <div className="flex items-center space-x-6">
                <Label htmlFor="version" className="font-normal">
                  Version
                </Label>
              </div>
              <Select>
                <SelectTrigger className="w-[100px] border-none shadow-none h-7 hover:bg-muted focus:bg-muted focus:ring-0">
                  <SelectValue defaultValue={"light"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">5.1</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-fit gap-6 items-center justify-center bg-slate-50 bg-opacity-30 px-5 pt-5 py-6 rounded-lg border border-slate-200 border-opacity-50">
          <Label className="flex gap-1 items-center" htmlFor="model">
            Custom <InfoCircledIcon />
          </Label>
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="Style" className="font-normal">
              Add your own image model
            </Label>
            <Input placeholder="https://civitai.com/model/69420" />
          </div>
        </div>
      </div>
    </div>
  );
};
