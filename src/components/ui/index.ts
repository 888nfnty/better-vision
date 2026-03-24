/**
 * BETTER Design System — UI primitives barrel export.
 *
 * All composable, CVA-based primitives for the tradebetter-led redesign.
 * Includes shadcn/ui components (Card, Dialog, Sheet, Badge, Separator).
 */
export { Button, buttonVariants } from "./Button";
export type { ButtonProps } from "./Button";

export { Section } from "./Section";
export type { SectionProps } from "./Section";

export { Heading } from "./Heading";
export type { HeadingProps } from "./Heading";

/* shadcn/ui components — installed via npx shadcn@latest add */
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./card";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./sheet";

export { Badge, badgeVariants } from "./badge";

export { Separator } from "./separator";
