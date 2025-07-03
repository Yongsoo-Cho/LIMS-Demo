import React from "react";

// Built-in Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";

// Utils
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getContrastTextColor, hslToRgb, rgbToHsl, to_boolean, to_date, to_number } from "../typeConvert";

// Types
import { Cell } from "../processMetadata";
import { Checkbox } from "@/components/ui/checkbox";

export interface CellProps {
  cell: Cell,
  isEditing: boolean,
  isEditMode: boolean,
  pt: [number, number],
  handleKeyDown: (e: React.KeyboardEvent) => void,
  handleCellChange: (s: string, pt: [number, number]) => void
  setEdit: (pt: [number, number] | null) => void
}

export interface EnumProps extends CellProps {
  hdr: string
  binds: { [key: string]: [number, number, number] }
  updateType: (h: string, v: string, c: [number, number, number]) => void
  addType: (h: string, v: string, c: [number, number, number]) => void
  delType: (h: string, v: string, c: [number, number, number]) => void
}

export class AbstractCell<T> extends React.Component<T> {

  constructor(props: T) {
    super(props)
  }
}

export class DefaultCell extends AbstractCell<CellProps> {

  constructor(props: CellProps) {
    super(props);
  }

  render() {
    if (this.props.isEditing) {
      return <input
          type="text"
          value={this.props.cell.value}
          onChange={(e) => this.props.handleCellChange(e.target.value, this.props.pt)}
          onKeyDown={this.props.handleKeyDown}
          onBlur={() => { this.props.setEdit(null) }}
          className="w-full px-1 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    }
    
    return <button
      onClick={() => {
        if (this.props.isEditMode) this.props.setEdit(this.props.pt);
      }}
    >
      {this.props.cell.value}
    </button>
    
  }
}

export class NumberCell extends DefaultCell {
  render() {
      if (this.props.isEditing) {
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={this.props.cell.value}
              onChange={(e) => this.props.handleCellChange(Number.parseFloat(e.target.value).toString() || "0", this.props.pt)}
              onKeyDown={(e) => this.props.handleKeyDown(e)}
              onBlur={() => this.props.setEdit(null)}
              className="w-24 h-8 text-sm"
              autoFocus
            />
          </div>
        )
    }

    return (
        <button
          onClick={() => {
            if (this.props.isEditMode) this.props.setEdit(this.props.pt);
          }}
        >
          {this.props.cell.value}
        </button>
    )
  }
}

export class DateCell extends DefaultCell {
  render() {
    if (this.props.isEditing) {
      return <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal h-8 text-sm",
                    !this.props.cell.value && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {this.props.cell.value ? format(this.props.cell.value, "PPP HH:mm") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={(to_date(this.props.cell.value) ? new Date(this.props.cell.value) : new Date())}
                  onSelect={(date) => date && this.props.handleCellChange((date.toString()), this.props.pt)}
                />
                <div className="p-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label>Time</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        className="w-[120px] h-8"
                        value={format(this.props.cell.value || new Date(), "HH:mm")}
                        onChange={(e) => {
                          this.props.handleCellChange(e.target.value, this.props.pt)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
      </div>
    }

    return <button
      className="flex items-center justify-between group"
      onClick={() => {
            if (this.props.isEditMode) this.props.setEdit(this.props.pt);
          }}
    >
      <div className="flex items-center">
        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
        <span>{format(to_date(this.props.cell.value)!, "MMM d, yyyy")}</span>
        <Clock className="mx-2 h-3.5 w-3.5 text-muted-foreground" />
        <span>{format(to_date(this.props.cell.value)!, "h:mm a")}</span>
      </div>
    </button>
  }
}

export class BooleanCell extends DefaultCell {
  render() {
    let format: boolean | null = to_boolean(this.props.cell.value)
    if (format === null) {
      return <div>
        <i>deprecated</i>
        <button
          onClick={() => { this.props.setEdit(this.props.pt); this.props.handleCellChange("false", this.props.pt)} }
          className={cn(
            "your-classes-come-here",
            this.props.isEditing ? "" : "hidden"
          )}
        >
          Reset
        </button>
      </div>
    }

    return (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={format}
          disabled={!this.props.isEditMode}
          onClick={() => this.props.setEdit(this.props.pt)}
          onKeyDown={(e: React.KeyboardEvent) => { this.props.handleKeyDown(e) }}
          onBlur={() => { this.props.setEdit(null) }}
          onCheckedChange={(checked: boolean) => { this.props.handleCellChange((checked) ? "true" : "false", this.props.pt)} }
          className={cn(
            "h-5 w-5 rounded-xs border transition-colors",
            format ? "border-green-500 bg-green-500 text-primary-foreground" 
                   : "border-input bg-background",
          )}
        />

      </div>
    )
  }
}

export class EnumCell extends AbstractCell<EnumProps> {

  render() {

    const [R, G, B] = (this.props.binds)[this.props.cell.value] || [70,70,70];
    let [R2, G2, B2] = getContrastTextColor([R,G,B]);

    let bg_cstr = `rgb(${R},${G},${B})`;
    let fg_cstr = `rgb(${R2},${G2},${B2})`;

    let style = { backgroundColor: bg_cstr, color: fg_cstr };

    console.log(fg_cstr, bg_cstr);

    if (this.props.isEditMode) {
      return (
          <div className="flex items-center gap-2">
            {/* open={this.state.open} */}
            <Select value={this.props.cell.value} onValueChange={(value) => this.props.handleCellChange(value, this.props.pt)}>
              
              {/* Edit mode: unfocused */}
              <SelectTrigger className="w-[140px] h-8 text-sm"> { /* onClick={this.open} */ }
                <SelectValue placeholder="null..."
                  style={style}
                >
                  {this.props.cell.value}
                </SelectValue>
              </SelectTrigger>

              {/* Edit mode: dropdown */}
              <SelectContent>
                {
                  Object.keys(this.props.binds).map((k) => 
                    <SelectItem key={k} value={k} >
                      <div className="flex items-center gap-2 p-1 cursor-pointer hover:bg-gray-100">
                        <div 
                          className={`w-2.5 h-2.5 rounded-full`} 
                          // style={style} This won't work (as intended) because all enums will have the same color
                        />
                        {k}
                      </div>
                    </SelectItem>
                  )
                }
              </SelectContent>
            </Select>
          </div>
        )
    }

    return (
      <span
        className={`w-fit max-w-32 inline-flex items-center border-none text-center rounded-full px-2 py-0.5 m-1 text-xs font-medium border`}
        style={style}
      >
        {this.props.cell.value}
      </span>
    )
  }
}
