import {
  ArrowDown,
  ArrowRightLeft,
  ArrowUp,
  BadgeDollarSign,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Contact,
  CreditCard,
  Dices,
  DollarSign,
  Eye,
  EyeOff,
  FileDownIcon,
  FileSpreadsheet,
  FileTerminal,
  LocateFixed,
  LogOut,
  Moon,
  MoreHorizontal,
  MoreVertical,
  MoveLeft,
  PenLine,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Settings2,
  ShoppingBag,
  Sun,
  Table,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  close: X,
  view: Eye,
  hide: EyeOff,
  moveLeft: MoveLeft,
  user: User,
  terminal: FileTerminal,
  settings: Settings,
  logout: LogOut,
  store: ShoppingBag,
  billing: CreditCard,
  dollarSign: DollarSign,
  transaction: ArrowRightLeft,
  account: BadgeDollarSign,
  chevronsLeft: ChevronsLeft,
  chevronLeft: ChevronLeft,
  chevronsRight: ChevronsRight,
  chevronRight: ChevronRight,
  moon: Moon,
  sun: Sun,
  verticalThreeDots: MoreVertical,
  horizontalThreeDots: MoreHorizontal,
  search: Search,
  users: Users,
  table: Table,
  fileSpreadSheet: FileSpreadsheet,
  plus: Plus,
  penLine: PenLine,
  contact: Contact,
  locateFixed: LocateFixed,
  settings2: Settings2,
  chevronsUpDown: ChevronsUpDown,
  check: Check,
  trash: Trash2,
  dices: Dices,
  fileDownload: FileDownIcon,
  plusCircle: PlusCircle,
  calendar: Calendar,
  spinner: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};
