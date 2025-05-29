
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react"; 
import { useAuth as useSimulatedAuth } from "@/contexts/AuthContext"; 
import { Edit3 } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import type { Locale } from '@/lib/i1n-config';

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }), // TODO: Translate messages
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Placeholder dictionary
const getProfilePageDictionary = (locale: Locale) => {
  if (locale === 'uz') {
    return {
      profileInfoTitle: "Profil Ma'lumotlari",
      profileInfoDesc: "Shaxsiy ma'lumotlaringizni ko'ring va yangilang. Ijtimoiy tarmoqlar orqali kirilgan email provayder tomonidan boshqariladi.",
      fullNameLabel: "To'liq Ism",
      emailAddressLabel: "Elektron Pochta Manzili",
      emailManagedByProvider: "Email sizning identifikatsiya provayderingiz tomonidan boshqariladi va bu yerda o'zgartirilmaydi.",
      emailForLogin: "Tizimga kirish uchun ishlatiladigan email.",
      phoneLabel: "Telefon Raqami (ixtiyoriy)",
      phonePlaceholder: "masalan, +998 90 123-45-67",
      phoneBackendNote: "Telefon raqamlarini saqlash uchun backend integratsiyasi talab qilinadi.",
      saveChangesButton: "O'zgarishlarni Saqlash (Mijoz Demosi)",
      loadingProfile: "Profil yuklanmoqda...",
      pleaseLogin: "Profilingizni ko'rish uchun kiring.",
      updateDemoTitle: "Profil Yangilanishi (Demo)",
      updateDemoDesc: "Profil ma'lumotlari qayd etildi. Haqiqiy yangilash uchun backend integratsiyasi talab etiladi."
    };
  }
  if (locale === 'ru') {
    return {
      profileInfoTitle: "Информация профиля",
      profileInfoDesc: "Просмотр и обновление ваших личных данных. Email для входа через соцсети управляется провайдером.",
      fullNameLabel: "Полное имя",
      emailAddressLabel: "Адрес электронной почты",
      emailManagedByProvider: "Email управляется вашим провайдером идентификации и не может быть изменен здесь.",
      emailForLogin: "Email, используемый для входа.",
      phoneLabel: "Номер телефона (необязательно)",
      phonePlaceholder: "например, +7 900 123-45-67",
      phoneBackendNote: "Для сохранения номеров телефонов требуется интеграция с бэкендом.",
      saveChangesButton: "Сохранить изменения (Демо на клиенте)",
      loadingProfile: "Загрузка профиля...",
      pleaseLogin: "Пожалуйста, войдите, чтобы просмотреть свой профиль.",
      updateDemoTitle: "Обновление профиля (Демо)",
      updateDemoDesc: "Информация профиля принята. Для реального обновления требуется интеграция с бэкендом."
    };
  }
  return { // en
    profileInfoTitle: "Profile Information",
    profileInfoDesc: "View and update your personal details. Email for social logins is managed by the provider.",
    fullNameLabel: "Full Name",
    emailAddressLabel: "Email Address",
    emailManagedByProvider: "Email is managed by your identity provider and cannot be changed here.",
    emailForLogin: "Email used for login.",
    phoneLabel: "Phone Number (Optional)",
    phonePlaceholder: "e.g., +1 555-123-4567",
    phoneBackendNote: "Storing phone numbers requires backend database integration.",
    saveChangesButton: "Save Changes (Client Demo)",
    loadingProfile: "Loading profile...",
    pleaseLogin: "Please log in to view your profile.",
    updateDemoTitle: "Profile Update (Demo)",
    updateDemoDesc: "Profile information noted. Actual update would require backend integration."
  };
};


export default function ProfilePage() {
  const { toast } = useToast();
  const params = useParams();
  const locale = params.locale as Locale || 'uz';
  const dictionary = getProfilePageDictionary(locale);

  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const { currentUser: simulatedUser, isLoading: isLoadingSimulatedAuth } = useSimulatedAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  useEffect(() => {
    let name = "";
    let email = "";

    if (nextAuthSession?.user) {
      name = nextAuthSession.user.name || "";
      email = nextAuthSession.user.email || "";
    } else if (simulatedUser) {
      name = simulatedUser.name || "";
      email = simulatedUser.email || "";
    }
    
    form.reset({ name, email, phone: "" });
  }, [nextAuthSession, simulatedUser, form]);

  async function onSubmit(data: ProfileFormValues) {
    console.log("Profile data to update:", data);
    toast({
      title: dictionary.updateDemoTitle,
      description: dictionary.updateDemoDesc,
    });
  }
  
  if (nextAuthStatus === "loading" || isLoadingSimulatedAuth) {
    return <div className="flex justify-center items-center p-10"><p>{dictionary.loadingProfile}</p></div>;
  }

  if (nextAuthStatus === "unauthenticated" && !simulatedUser) {
    return <div className="flex justify-center items-center p-10"><p>{dictionary.pleaseLogin}</p></div>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{dictionary.profileInfoTitle}</CardTitle>
        <CardDescription>{dictionary.profileInfoDesc}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>{dictionary.fullNameLabel}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.emailAddressLabel}</FormLabel>
                  <FormControl><Input type="email" {...field} disabled={!!nextAuthSession?.user?.email} /></FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground pt-1">
                    {nextAuthSession?.user?.email ? dictionary.emailManagedByProvider : dictionary.emailForLogin}
                  </p>
                </FormItem>
              )}/>
            <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.phoneLabel}</FormLabel>
                  <FormControl><Input type="tel" {...field} placeholder={dictionary.phonePlaceholder} /></FormControl>
                  <FormMessage />
                   <p className="text-xs text-muted-foreground pt-1">{dictionary.phoneBackendNote}</p>
                </FormItem>
              )}/>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
              <Edit3 className="mr-2 h-4 w-4" /> {dictionary.saveChangesButton}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// Delete original: src/app/account/profile/page.tsx
