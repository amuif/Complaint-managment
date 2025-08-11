// 'use client';

// import { useState } from 'react';

// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
// import { useLanguage } from '@/components/language-provider';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// export default function SystemSettingsPage() {
//   const { t } = useLanguage();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSave = () => {
//     setIsLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">{t('systemSettings')}</h1>
//         <p className="text-muted-foreground">{t('systemSettingsDesc')}</p>
//       </div>

//       <Tabs defaultValue="general" className="w-full">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="general">{t('general')}</TabsTrigger>
//           <TabsTrigger value="security">{t('security')}</TabsTrigger>
//           <TabsTrigger value="localization">{t('localization')}</TabsTrigger>
//           <TabsTrigger value="integrations">{t('integrations')}</TabsTrigger>
//           <TabsTrigger value="advanced">{t('advanced')}</TabsTrigger>
//         </TabsList>

//         <TabsContent value="general" className="space-y-4 mt-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>{t('systemInformation')}</CardTitle>
//               <CardDescription>{t('systemInformationDesc')}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="systemName">{t('systemName')}</Label>
//                   <Input
//                     id="systemName"
//                     placeholder={t('systemName')}
//                     defaultValue="FM Customer Feedback System"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="systemVersion">{t('systemVersion')}</Label>
//                   <Input id="systemVersion" defaultValue="1.0.0" disabled />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="adminEmail">{t('adminEmail')}</Label>
//                   <Input
//                     id="adminEmail"
//                     placeholder={t('adminEmail')}
//                     defaultValue="admin@example.gov.et"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="supportPhone">{t('supportPhone')}</Label>
//                   <Input
//                     id="supportPhone"
//                     placeholder={t('supportPhone')}
//                     defaultValue="+251 91 234 5678"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="systemDescription">{t('systemDescription')}</Label>
//                 <Textarea
//                   id="systemDescription"
//                   placeholder={t('systemDescription')}
//                   defaultValue={t('systemDescriptionDefault')}
//                 />
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-end">
//               <Button onClick={handleSave} disabled={isLoading}>
//                 {isLoading ? t('saving') : t('saveChanges')}
//               </Button>
//             </CardFooter>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>{t('maintenanceMode')}</CardTitle>
//               <CardDescription>{t('maintenanceModeDesc')}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">{t('enableMaintenanceMode')}</p>
//                   <p className="text-sm text-muted-foreground">{t('enableMaintenanceModeDesc')}</p>
//                 </div>
//                 <Switch />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="maintenanceMessage">{t('maintenanceMessage')}</Label>
//                 <Textarea
//                   id="maintenanceMessage"
//                   placeholder={t('maintenanceMessagePlaceholder')}
//                   defaultValue={t('maintenanceMessageDefault')}
//                 />
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-end">
//               <Button onClick={handleSave} disabled={isLoading}>
//                 {isLoading ? t('saving') : t('saveChanges')}
//               </Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>

//         <TabsContent value="security" className="space-y-4 mt-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>{t('securitySettings')}</CardTitle>
//               <CardDescription>{t('securitySettingsDesc')}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-medium">{t('twoFactorAuth')}</p>
//                     <p className="text-sm text-muted-foreground">{t('twoFactorAuthDesc')}</p>
//                   </div>
//                   <Switch defaultChecked />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-medium">{t('passwordExpiry')}</p>
//                     <p className="text-sm text-muted-foreground">{t('passwordExpiryDesc')}</p>
//                   </div>
//                   <Switch defaultChecked />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="passwordExpiryDays">{t('passwordExpiryDays')}</Label>
//                   <Select defaultValue="90">
//                     <SelectTrigger id="passwordExpiryDays">
//                       <SelectValue placeholder={t('selectDays')} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="30">30 {t('days')}</SelectItem>
//                       <SelectItem value="60">60 {t('days')}</SelectItem>
//                       <SelectItem value="90">90 {t('days')}</SelectItem>
//                       <SelectItem value="180">180 {t('days')}</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="sessionTimeout">{t('sessionTimeout')}</Label>
//                   <Select defaultValue="30">
//                     <SelectTrigger id="sessionTimeout">
//                       <SelectValue placeholder={t('selectMinutes')} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="15">15 {t('minutes')}</SelectItem>
//                       <SelectItem value="30">30 {t('minutes')}</SelectItem>
//                       <SelectItem value="60">60 {t('minutes')}</SelectItem>
//                       <SelectItem value="120">120 {t('minutes')}</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-end">
//               <Button onClick={handleSave} disabled={isLoading}>
//                 {isLoading ? t('saving') : t('saveChanges')}
//               </Button>
//             </CardFooter>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>{t('loginAttempts')}</CardTitle>
//               <CardDescription>{t('loginAttemptsDesc')}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">{t('limitLoginAttempts')}</p>
//                   <p className="text-sm text-muted-foreground">{t('limitLoginAttemptsDesc')}</p>
//                 </div>
//                 <Switch defaultChecked />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="maxLoginAttempts">{t('maxLoginAttempts')}</Label>
//                 <Select defaultValue="5">
//                   <SelectTrigger id="maxLoginAttempts">
//                     <SelectValue placeholder={t('selectAttempts')} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="3">3 {t('attempts')}</SelectItem>
//                     <SelectItem value="5">5 {t('attempts')}</SelectItem>
//                     <SelectItem value="10">10 {t('attempts')}</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="lockoutDuration">{t('lockoutDuration')}</Label>
//                 <Select defaultValue="15">
//                   <SelectTrigger id="lockoutDuration">
//                     <SelectValue placeholder={t('selectMinutes')} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="5">5 {t('minutes')}</SelectItem>
//                     <SelectItem value="15">15 {t('minutes')}</SelectItem>
//                     <SelectItem value="30">30 {t('minutes')}</SelectItem>
//                     <SelectItem value="60">60 {t('minutes')}</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-end">
//               <Button onClick={handleSave} disabled={isLoading}>
//                 {isLoading ? t('saving') : t('saveChanges')}
//               </Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>

//         <TabsContent value="localization" className="space-y-4 mt-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>{t('languageSettings')}</CardTitle>
//               <CardDescription>{t('languageSettingsDesc')}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="defaultLanguage">{t('defaultLanguage')}</Label>
//                 <Select defaultValue="en">
//                   <SelectTrigger id="defaultLanguage">
//                     <SelectValue placeholder={t('selectLanguage')} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="en">English</SelectItem>
//                     <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
//                     <SelectItem value="af">Afaan Oromo</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">{t('enableMultiLanguage')}</p>
//                   <p className="text-sm text-muted-foreground">{t('enableMultiLanguageDesc')}</p>
//                 </div>
//                 <Switch defaultChecked />
//               </div>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">{t('autoDetectLanguage')}</p>
//                   <p className="text-sm text-muted-foreground">{t('autoDetectLanguageDesc')}</p>
//                 </div>
//                 <Switch defaultChecked />
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-end">
//               <Button onClick={handleSave} disabled={isLoading}>
//                 {isLoading ? t('saving') : t('saveChanges')}
//               </Button>
//             </CardFooter>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>{t('dateTimeSettings')}</CardTitle>
//               <CardDescription>{t('dateTimeSettingsDesc')}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="timezone">{t('timezone')}</Label>
//                 <Select defaultValue="africa-addis_ababa">
//                   <SelectTrigger id="timezone">
//                     <SelectValue placeholder={t('selectTimezone')} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="africa-addis_ababa">Africa/Addis_Ababa (GMT+3)</SelectItem>
//                     <SelectItem value="africa-nairobi">Africa/Nairobi (GMT+3)</SelectItem>
//                     <SelectItem value="africa-cairo">Africa/Cairo (GMT+2)</SelectItem>
//                     <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="dateFormat">{t('dateFormat')}</Label>
//                 <Select defaultValue="dd-mm-yyyy">
//                   <SelectTrigger id="dateFormat">
//                     <SelectValue placeholder={t('selectDateFormat')} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
//                     <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
//                     <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="timeFormat">{t('timeFormat')}</Label>
//                 <Select defaultValue="24h">
//                   <SelectTrigger id="timeFormat">
//                     <SelectValue placeholder={t('selectTimeFormat')} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
//                     <SelectItem value="24h">24-hour</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-end">
//               <Button onClick={handleSave} disabled={isLoading}>
//                 {isLoading ? t('saving') : t('saveChanges')}
//               </Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>

//         <TabsContent value="integrations" className="space-y-4 mt-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>{t('apiSettings')}</CardTitle>
//               <CardDescription>{t('apiSettingsDesc')}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">{t('enableApi')}</p>
//                   <p className="text-sm text-muted-foreground">{t('enableApiDesc')}</p>
//                 </div>
//                 <Switch defaultChecked />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="apiKey">{t('apiKey')}</Label>
//                 {/* <div className="flex gap-2">
//                   <Input
//                     id="apiKey"
//                     defaultValue="sk_live_51NZVgHJKLMNOPQRSTUVWXYZ12345678901234567890"
//                     type="password"
//                     className="flex-1"
//                   />
//                   <Button variant="outline">{t('regenerate')}</Button>
//                 </div> */}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="webhookUrl">{t('webhookUrl')}</Label>
//                 <Input id="webhookUrl" placeholder="https://example.com/webhook" />
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-end">
//               <Button onClick={handleSave} disabled={isLoading}>
//                 {isLoading ? t('saving') : t('saveChanges')}
//               </Button>
//             </CardFooter>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>{t('smsIntegration')}</CardTitle>
//               <CardDescription>{t('smsIntegrationDesc')}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">{t('enableSms')}</p>
//                   <p className="text-sm text-muted-foreground">{t('enableSmsDesc')}</p>
//                 </div>
//                 <Switch defaultChecked />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="smsProvider">{t('smsProvider')}</Label>
//                 <Select defaultValue="ethiotel">
//                   <SelectTrigger id="smsProvider">
//                     <SelectValue placeholder={t('selectProvider')} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ethiotel">Ethio Telecom</SelectItem>
//                     <SelectItem value="safaricom">Safaricom</SelectItem>
//                     <SelectItem value="twilio">Twilio</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="smsApiKey">{t('smsApiKey')}</Label>
//                 <Input id="smsApiKey" type="password" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="smsSenderId">{t('smsSenderId')}</Label>
//                 <Input id="smsSenderId" placeholder="FM-FEEDBACK" />
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-end">
//               <Button onClick={handleSave} disabled={isLoading}>
//                 {isLoading ? t('saving') : t('saveChanges')}
//               </Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>

//         <TabsContent value="advanced" className="space-y-4 mt-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>{t('backupSettings')}</CardTitle>
//               <CardDescription>{t('backupSettingsDesc')}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">{t('enableAutoBackup')}</p>
//                   <p className="text-sm text-muted-foreground">{t('enableAutoBackupDesc')}</p>
//                 </div>
//                 <Switch defaultChecked />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="backupFrequency">{t('backupFrequency')}</Label>
//                 <Select defaultValue="daily">
//                   <SelectTrigger id="backupFrequency">
//                     <SelectValue placeholder={t('selectFrequency')} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="hourly">{t('hourly')}</SelectItem>
//                     <SelectItem value="daily">{t('daily')}</SelectItem>
//                     <SelectItem value="weekly">{t('weekly')}</SelectItem>
//                     <SelectItem value="monthly">{t('monthly')}</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="backupRetention">{t('backupRetention')}</Label>
//                 <Select defaultValue="30">
//                   <SelectTrigger id="backupRetention">
//                     <SelectValue placeholder={t('selectDays')} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="7">7 {t('days')}</SelectItem>
//                     <SelectItem value="14">14 {t('days')}</SelectItem>
//                     <SelectItem value="30">30 {t('days')}</SelectItem>
//                     <SelectItem value="90">90 {t('days')}</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex justify-end">
//                 <Button variant="outline">{t('backupNow')}</Button>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-end">
//               <Button onClick={handleSave} disabled={isLoading}>
//                 {isLoading ? t('saving') : t('saveChanges')}
//               </Button>
//             </CardFooter>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>{t('dangerZone')}</CardTitle>
//               <CardDescription>{t('dangerZoneDesc')}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-4">
//                 <div className="rounded-md border border-destructive/50 p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className="font-medium text-destructive">{t('resetSystem')}</h4>
//                       <p className="text-sm text-muted-foreground">{t('resetSystemDesc')}</p>
//                     </div>
//                     <Button variant="destructive">{t('resetSystem')}</Button>
//                   </div>
//                 </div>
//                 <div className="rounded-md border border-destructive/50 p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className="font-medium text-destructive">{t('purgeData')}</h4>
//                       <p className="text-sm text-muted-foreground">{t('purgeDataDesc')}</p>
//                     </div>
//                     <Button variant="destructive">{t('purgeData')}</Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
