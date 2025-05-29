
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Keep if used, seems not directly
import { useSession } from "next-auth/react";
import { Chrome, Send, Globe, Link2, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react"; // Added for React.ElementType
import { useParams } from "next/navigation";
import type { Locale } from '@/lib/i1n-config';

interface LinkedAccount {
  provider: string;
  name: string;
  icon: React.ElementType;
  linked: boolean;
  email?: string; 
}

// Placeholder dictionary
const getLinkingDictionary = (locale: Locale) => {
  if (locale === 'uz') {
    return {
      title: "Hisoblarni Bog'lash",
      description: "Osonroq kirish uchun ulangan ijtimoiy hisoblaringizni boshqaring.",
      connectedAccountsTitle: "Ulangan Hisoblar",
      connectedAccountsDesc: "Bu hisoblar hozirda ScentSational Showcase profilingizga ulangan.",
      google: "Google",
      telegram: "Telegram",
      yandex: "Yandex",
      linkedStatus: "Ulangan",
      linkAccountButton: "Hisobni Bog'lash",
      unlinkButton: "Uzish",
      featureComingSoonTitle: "Funksiya Tez Kunda",
      linkFeatureComingSoon: (provider: string) => `${provider} bilan bog'lanish hali amalga oshirilmagan.`,
      unlinkFeatureComingSoon: (provider: string) => `${provider}ni uzish hali amalga oshirilmagan. Bu odatda backend chaqiruvini o'z ichiga oladi.`,
      unlinkNotAllowedTitle: "Uzish Mumkin Emas",
      unlinkNotAllowedDesc: "Yagona kirish usulingizni uza olmaysiz.",
      primarySignInMethodNote: "Bu sizning asosiy kirish usulingiz. Agar boshqa usullar bog'lanmagan bo'lsa, uzish sizni tizimdan chiqarib yuborishi mumkin."
    };
  }
  // Add RU and EN similarly
  return { // en
      title: "Account Linking",
      description: "Manage your connected social accounts for easier sign-in.",
      connectedAccountsTitle: "Connected Accounts",
      connectedAccountsDesc: "These accounts are currently linked to your ScentSational Showcase profile.",
      google: "Google",
      telegram: "Telegram",
      yandex: "Yandex",
      linkedStatus: "Linked",
      linkAccountButton: "Link Account",
      unlinkButton: "Unlink",
      featureComingSoonTitle: "Feature Coming Soon",
      linkFeatureComingSoon: (provider: string) => `Linking with ${provider} is not yet implemented.`,
      unlinkFeatureComingSoon: (provider: string) => `Unlinking ${provider} is not yet implemented. This would typically involve a backend call.`,
      unlinkNotAllowedTitle: "Unlink Not Allowed",
      unlinkNotAllowedDesc: "You cannot unlink your only sign-in method.",
      primarySignInMethodNote: "This is your primary sign-in method. Unlinking may lock you out if no other methods are linked."
  };
};


export default function AccountLinkingPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const params = useParams();
  const locale = params.locale as Locale || 'uz';
  const dictionary = getLinkingDictionary(locale);

  const linkedAccounts: LinkedAccount[] = [
    { provider: "google", name: dictionary.google, icon: Chrome, linked: session?.user?.email ? true : false, email: session?.user?.email || undefined },
    { provider: "telegram", name: dictionary.telegram, icon: Send, linked: false },
    { provider: "yandex", name: dictionary.yandex, icon: Globe, linked: false },
  ];

  const handleLinkAccount = (provider: string) => {
    toast({
      title: dictionary.featureComingSoonTitle,
      description: dictionary.linkFeatureComingSoon(provider),
    });
  };

  const handleUnlinkAccount = (providerKey: string, providerName: string) => {
     if (providerKey === "google" && linkedAccounts.filter(acc => acc.linked).length <= 1) {
        toast({
            title: dictionary.unlinkNotAllowedTitle,
            description: dictionary.unlinkNotAllowedDesc,
            variant: "destructive",
        });
        return;
    }
    toast({
      title: dictionary.featureComingSoonTitle,
      description: dictionary.unlinkFeatureComingSoon(providerName),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{dictionary.title}</h2>
        <p className="text-muted-foreground">{dictionary.description}</p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{dictionary.connectedAccountsTitle}</CardTitle>
          <CardDescription>{dictionary.connectedAccountsDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {linkedAccounts.map((account) => (
            <div key={account.provider}>
              <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <account.icon className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{account.name}</p>
                    {account.linked && account.email && (
                        <p className="text-xs text-muted-foreground">{account.email}</p>
                    )}
                  </div>
                </div>
                {account.linked ? (
                  <div className="flex items-center space-x-2">
                     <span className="text-sm text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/> {dictionary.linkedStatus}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlinkAccount(account.provider, account.name)}
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      {dictionary.unlinkButton}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLinkAccount(account.name)}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Link2 className="mr-2 h-4 w-4" /> {dictionary.linkAccountButton}
                  </Button>
                )}
              </div>
               {account.provider === "google" && account.linked && linkedAccounts.filter(acc => acc.linked).length <=1 && (
                 <p className="text-xs text-muted-foreground mt-1 pl-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" /> {dictionary.primarySignInMethodNote}
                 </p>
               )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Delete original: src/app/account/linking/page.tsx
