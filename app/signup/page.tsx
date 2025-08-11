'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/components/language-provider';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SignUpPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t('signupSuccess'),
        description: t('signupSuccessMessage'),
      });
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent py-2 pl-3 pr-5 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:left-8 md:top-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('back')}
      </Link>

      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-8">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{t('createAccount')}</h1>
            <p className="text-sm text-muted-foreground">{t('signupSubtitle')}</p>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {/* Full Name - English */}
                <div className="grid gap-2">
                  <Label htmlFor="nameEn">{t('fullNameEnglish')}</Label>
                  <Input
                    id="nameEn"
                    placeholder={t('fullNamePlaceholder')}
                    type="text"
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect="off"
                    className="rounded-lg"
                    required
                  />
                </div>

                {/* Full Name - Amharic */}
                <div className="grid gap-2">
                  <Label htmlFor="nameAm">{t('fullNameAmharic')}</Label>
                  <Input
                    id="nameAm"
                    placeholder={t('fullNameAmharicPlaceholder')}
                    type="text"
                    className="rounded-lg font-amharic"
                    dir="auto"
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    className="rounded-lg"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="grid gap-2">
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <Input
                    id="phone"
                    placeholder="+251 91 234 5678"
                    type="tel"
                    autoCapitalize="none"
                    autoComplete="tel"
                    autoCorrect="off"
                    className="rounded-lg"
                    required
                  />
                </div>

                {/* Address - English */}
                <div className="grid gap-2">
                  <Label htmlFor="addressEn">{t('addressEnglish')}</Label>
                  <Input
                    id="addressEn"
                    placeholder={t('addressPlaceholder')}
                    type="text"
                    className="rounded-lg"
                  />
                </div>

                {/* Address - Amharic */}
                <div className="grid gap-2">
                  <Label htmlFor="addressAm">{t('addressAmharic')}</Label>
                  <Input
                    id="addressAm"
                    placeholder={t('addressAmharicPlaceholder')}
                    type="text"
                    className="rounded-lg font-amharic"
                    dir="auto"
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      className="rounded-lg"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">
                        {showPassword ? t('hidePassword') : t('showPassword')}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    className="rounded-lg"
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="rounded-lg">
                  {isLoading ? t('creatingAccount') : t('createAccount')}
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('orContinueWith')}
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Button variant="outline" type="button" className="rounded-lg">
                {t('signupWithSSO')}
              </Button>
            </div>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            {t('alreadyHaveAccount')}{' '}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-primary/80" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logos-removebg-preview-ZSzaSFuDxZhWUNiUwKrbxsvdKDd6MU.png"
            alt="FM Logo"
            width={40}
            height={40}
            className="mr-2 h-8 w-8"
          />
          {t('appName')}
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">{t('signupQuote')}</p>
            <footer className="text-sm">{t('signupQuoteAuthor')}</footer>
          </blockquote>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/60 to-transparent" />
      </div>
    </div>
  );
}
