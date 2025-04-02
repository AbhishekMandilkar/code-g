import React, { Suspense } from "react";

export type Repo = {
  name: string;
  url: string;
  id: string;
};

const Layout = async ({
  children,
}: {
  children: React.ReactElement<{ repos?: Repo[] }>;
}) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

export default Layout;
