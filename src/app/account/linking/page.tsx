
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { Chrome, Send, Globe, Link2, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LinkedAccount {
  provider: string;
  name: string;
  icon: React.ElementType;
  linked: boolean;
  email?: string; 
}

export default function AccountLinkingPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  // Mock linked accounts state - in a real app, this would come from your backend
  // and update based on NextAuth account linking status.
  const linkedAccounts: LinkedAccount[] = [
    { provider: "google", name: "Google", icon: Chrome, linked: session?.user?.email ? true : false, email: session?.user?.email || undefined },
    { provider: "telegram", name: "Telegram", icon: Send, linked: false },
    { provider: "yandex", name: "Yandex", icon: Globe, linked: false },
  ];

  const handleLinkAccount = (provider: string) => {
    toast({
      title: "Feature Coming Soon",
      description: `Linking with ${provider} is not yet implemented.`,
    });
    // In a real app, this would initiate the OAuth flow for the specific provider
    // e.g., signIn(provider, { callbackUrl: '/account/linking' })
  };

  const handleUnlinkAccount = (provider: string) => {
     if (provider === "google" && linkedAccounts.filter(acc => acc.linked).length <= 1) {
        toast({
            title: "Unlink Not Allowed",
            description: "You cannot unlink your only sign-in method.",
            variant: "destructive",
        });
        return;
    }
    toast({
      title: "Feature Coming Soon",
      description: `Unlinking ${provider} is not yet implemented. This would typically involve a backend call.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Account Linking</h2>
        <p className="text-muted-foreground">
          Manage your connected social accounts for easier sign-in.
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            These accounts are currently linked to your ScentSational Showcase profile.
          </CardDescription>
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
                     <span className="text-sm text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/> Linked</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlinkAccount(account.name)}
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      Unlink
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLinkAccount(account.name)}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Link2 className="mr-2 h-4 w-4" /> Link Account
                  </Button>
                )}
              </div>
               {account.provider === "google" && account.linked && linkedAccounts.filter(acc => acc.linked).length <=1 && (
                 <p className="text-xs text-muted-foreground mt-1 pl-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" /> This is your primary sign-in method. Unlinking may lock you out if no other methods are linked.
                 </p>
               )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
