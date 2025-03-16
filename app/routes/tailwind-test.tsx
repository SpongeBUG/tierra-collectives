// app/routes/tailwind-test.tsx
import { LinksFunction, MetaFunction } from "@remix-run/node";
import { TailwindTest } from "~/components/TailwindTest";
import { MainLayout } from "~/components/layout/MainLayout";

export const meta: MetaFunction = () => {
  return [
    { title: "Tailwind Test | Tierra Collectives" },
    { name: "description", content: "Testing if Tailwind CSS is working properly" },
  ];
};

export default function TailwindTestRoute() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Tailwind CSS Test Page</h1>
        <p className="mb-8 text-gray-600">
          This page is designed to test if Tailwind CSS is properly configured and working in the application.
          You should see various styled elements below with different colors, spacing, and other visual properties.
        </p>
        
        <TailwindTest />
        
        <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Troubleshooting Tips</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Verify your Tailwind CSS configuration files are in the root directory</li>
            <li>Check that the CSS import in root.tsx doesn't use the ?url suffix</li>
            <li>Make sure PostCSS is configured properly</li>
            <li>Try restarting the dev server with --reset-cache</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}