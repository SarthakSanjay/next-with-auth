import { AuthPage } from "@/components/AuthPage";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Promise<{ oauthError?: string }>;
}) {
  const { slug } = await params;
  const { oauthError } = await searchParams;
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="w-full h-full bg-[#1b1b1e]"></div>
      <div className=" flex flex-col gap-4 p-6 md:p-10">
        <div className=" flex flex-1 items-center justify-center ">
          {oauthError && <div className="text-destructive">{oauthError}</div>}
          <div className="w-full max-w-xs ">
            <AuthPage type={slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
