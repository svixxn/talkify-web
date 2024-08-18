import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden w-64 border-r bg-muted/40 md:block">
        <div className="flex h-14 items-center border-b px-4">
          <h3 className="text-lg font-semibold">Chats</h3>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="space-y-1 p-4">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md bg-muted/50 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              prefetch={false}
            >
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <div className="font-medium">Acme Inc</div>
                <div className="text-muted-foreground">Hey, hows it going?</div>
              </div>
              <div className="text-xs text-muted-foreground">2:34 PM</div>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              prefetch={false}
            >
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <div className="font-medium">John Doe</div>
                <div className="text-muted-foreground">
                  Lets discuss the project.
                </div>
              </div>
              <div className="text-xs text-muted-foreground">11:42 AM</div>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              prefetch={false}
            >
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <div className="font-medium">Sarah Anderson</div>
                <div className="text-muted-foreground">
                  Did you see the new design?
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Yesterday</div>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              prefetch={false}
            >
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>MI</AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <div className="font-medium">Michael Ivanov</div>
                <div className="text-muted-foreground">
                  I have a question about the API.
                </div>
              </div>
              <div className="text-xs text-muted-foreground">2 days ago</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center border-b px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="font-medium">Acme Inc</div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <div className="font-medium">Acme Inc</div>
                <p>
                  Hey, hows it going? I wanted to follow up on the project we
                  discussed earlier.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="rounded-md bg-primary p-3 text-sm text-primary-foreground">
                <p>
                  Hi there! The project is going well. Ive made some progress on
                  the new feature and would love to discuss it with you.
                </p>
              </div>
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <div className="font-medium">Acme Inc</div>
                <p>
                  Thats great to hear! Im available anytime today to discuss the
                  new feature. Just let me know what time works best for you.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="rounded-md bg-primary p-3 text-sm text-primary-foreground">
                <p>
                  How about 3 PM? I can give you an update on the progress and
                  we can discuss the next steps.
                </p>
              </div>
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-background px-4 py-2 md:px-6">
          <div className="relative flex items-center gap-2">
            <Textarea
              placeholder="Type your message..."
              className="h-10 flex-1 resize-none rounded-md border border-input bg-transparent pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="submit" size="icon" className="absolute right-2">
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
