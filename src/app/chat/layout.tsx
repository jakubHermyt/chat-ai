interface ChatLayoutProps {
  children: React.ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="relative flex overflow-hidden">
      <div className="animate-in group w-full overflow-auto pl-0 duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
        {children}
      </div>
    </div>
  );
}
