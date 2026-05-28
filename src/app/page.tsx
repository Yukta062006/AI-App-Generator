import { prisma } from "@/lib/db";
import { DynamicRenderer } from "@/lib/engine/Renderer";
import { AppConfigSchema } from "@/lib/engine/schema";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Find or create a demo application
  let app = await prisma.application.findFirst({
    where: { name: "Demo App" },
  });

  const demoConfig = {
    name: "Smart CRM",
    description: "A metadata-driven contact management system",
    auth: { enabled: true, providers: ["credentials"] },
    i18n: {
      enabled: true,
      defaultLanguage: "en",
      languages: ["en", "hi"],
      translations: {
        en: {
          models: "Models",
          workflows: "Workflows",
          export: "Export Project",
          settings: "Settings",
          login: "Login",
          logout: "Logout",
          dashboard: "Dashboard",
          app_models: "App Models",
          models_description:
            "The data structures powering your application.",
          workflows_description:
            "Automated business logic and triggers.",
        },
        hi: {
          models: "मॉडल्स",
          workflows: "वर्कफ्लो",
          export: "प्रोजेक्ट एक्सपोर्ट करें",
          settings: "सेटिंग्स",
          login: "लॉगिन",
          logout: "लॉगआउट",
          dashboard: "डैशबोर्ड",
          app_models: "ऐप मॉडल्स",
          models_description:
            "आपके एप्लिकेशन को चलाने वाले डेटा स्ट्रक्चर।",
          workflows_description:
            "स्वचालित व्यावसायिक लॉजिक और ट्रिगर्स।",
        },
      },
    },
    notifications: { enabled: true },
    pwa: { enabled: true },
    models: [
      {
        name: "contacts",
        label: "Contacts",
        fields: [
          {
            name: "name",
            label: "Full Name",
            type: "text",
            required: true,
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
          },
          {
            name: "phone",
            label: "Phone Number",
            type: "text",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: ["Lead", "Customer", "Churned"],
            defaultValue: "Lead",
          },
        ],
      },
    ],
    pages: [
      {
        id: "dashboard",
        title: "Dashboard",
        path: "/",
        components: [
          {
            id: "header",
            type: "text",
            title: "Welcome to Smart CRM",
            props: {
              content: "Manage your relationships with ease.",
            },
          },
          {
            id: "contact-list",
            type: "table",
            modelName: "contacts",
            title: "Recent Contacts",
          },
        ],
      },
    ],
    workflows: [
      {
        name: "Log New Contact",
        modelName: "contacts",
        trigger: "on_create",
        actions: [
          {
            type: "log",
            params: {
              message: "A new contact was added to the CRM!",
            },
          },
        ],
      },
    ],
    theme: {
      primary: "#2563eb",
      darkMode: true,
    },
  };

  if (!app) {
    app = await prisma.application.create({
      data: {
        name: "Demo App",
        config: JSON.stringify(demoConfig),
      },
    });
  } else {
    app = await prisma.application.update({
      where: { id: app.id },
      data: {
        config: JSON.stringify(demoConfig),
      },
    });
  }

const config = AppConfigSchema.parse(
  JSON.parse(app.config as string)
);
  return (
    <main className="min-h-screen">
      <DynamicRenderer appId={app.id} config={config} />
    </main>
  );
}