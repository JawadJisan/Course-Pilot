"use client"

import { useState } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Shield, CreditCard, Bell, Globe, Lock, LogOut, AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    })
  }

  const handlePasswordChange = () => {
    setIsPasswordDialogOpen(false)
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    })
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Confirmation failed",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive",
      })
      return
    }

    setIsDeleteDialogOpen(false)
    setDeleteConfirmation("")
    toast({
      title: "Account deleted",
      description: "Your account has been permanently deleted",
      variant: "destructive",
    })
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
          <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
            <ChevronLeft className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="account">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 flex-shrink-0">
              <TabsList className="flex flex-col h-auto p-0 bg-transparent space-y-1">
                <TabsTrigger
                  value="account"
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted w-full"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted w-full"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted w-full"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted w-full"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted w-full"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1">
              <TabsContent value="account" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue="johndoe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Danger Zone</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                        <div>
                          <h4 className="font-medium text-destructive">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data
                          </p>
                        </div>
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="destructive">Delete Account</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                Delete Account
                              </DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove all
                                associated data from our servers.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="bg-muted p-4 rounded-lg text-sm">
                                <p>
                                  To confirm, type <strong>DELETE</strong> in the field below:
                                </p>
                              </div>
                              <Input
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="Type DELETE to confirm"
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteAccount}>
                                Delete Account
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSettings}>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>Manage your subscription and payment methods</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Current Plan</h3>
                          <p className="text-sm text-muted-foreground">You are currently on the Pro plan</p>
                        </div>
                        <Badge className="bg-primary">Pro</Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm">
                            <span className="text-2xl font-bold">$19.99</span> / month
                          </p>
                          <p className="text-sm text-muted-foreground">Renews on June 15, 2025</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Change Plan
                          </Button>
                          <Button variant="destructive" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Payment Methods</h3>
                        <Button variant="outline" size="sm">
                          Add Method
                        </Button>
                      </div>

                      <div className="border rounded-lg divide-y">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted p-2 rounded">
                              <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-sm text-muted-foreground">Expires 04/2026</p>
                            </div>
                          </div>
                          <Badge>Default</Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Billing History</h3>
                      <div className="border rounded-lg divide-y">
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium">May 15, 2025</p>
                            <p className="text-sm text-muted-foreground">Pro Plan - Monthly</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">$19.99</p>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              Download
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium">April 15, 2025</p>
                            <p className="text-sm text-muted-foreground">Pro Plan - Monthly</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">$19.99</p>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-course-updates" className="font-medium">
                              Course Updates
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications about course updates and new content
                            </p>
                          </div>
                          <Switch id="email-course-updates" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-interview-reminders" className="font-medium">
                              Interview Reminders
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive reminders about upcoming interview sessions
                            </p>
                          </div>
                          <Switch id="email-interview-reminders" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-certificate-issued" className="font-medium">
                              Certificate Issued
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications when you earn a new certificate
                            </p>
                          </div>
                          <Switch id="email-certificate-issued" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-marketing" className="font-medium">
                              Marketing Emails
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive promotional emails and special offers
                            </p>
                          </div>
                          <Switch id="email-marketing" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Push Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="push-course-reminders" className="font-medium">
                              Course Reminders
                            </Label>
                            <p className="text-sm text-muted-foreground">Receive reminders to continue your courses</p>
                          </div>
                          <Switch id="push-course-reminders" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="push-interview-alerts" className="font-medium">
                              Interview Alerts
                            </Label>
                            <p className="text-sm text-muted-foreground">Receive alerts about upcoming interviews</p>
                          </div>
                          <Switch id="push-interview-alerts" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSettings}>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize how CoursePilot looks for you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Theme</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 cursor-pointer bg-background">
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">Light</span>
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                          <div className="h-20 bg-muted rounded-md border"></div>
                        </div>
                        <div className="border rounded-lg p-4 cursor-pointer">
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">Dark</span>
                          </div>
                          <div className="h-20 bg-zinc-900 rounded-md border border-zinc-800"></div>
                        </div>
                        <div className="border rounded-lg p-4 cursor-pointer">
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">System</span>
                          </div>
                          <div className="h-20 bg-gradient-to-r from-zinc-100 to-zinc-900 rounded-md border"></div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Font Size</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="border rounded-lg p-4 cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Small</span>
                          </div>
                          <p className="text-sm">Aa</p>
                        </div>
                        <div className="border rounded-lg p-4 cursor-pointer bg-muted/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Medium</span>
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-base">Aa</p>
                        </div>
                        <div className="border rounded-lg p-4 cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Large</span>
                          </div>
                          <p className="text-lg">Aa</p>
                        </div>
                        <div className="border rounded-lg p-4 cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Extra Large</span>
                          </div>
                          <p className="text-xl">Aa</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSettings}>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Password</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Change Password</h4>
                          <p className="text-sm text-muted-foreground">
                            Update your password to keep your account secure
                          </p>
                        </div>
                        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline">Change Password</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change Password</DialogTitle>
                              <DialogDescription>
                                Enter your current password and a new password to update your credentials.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handlePasswordChange}>Update Password</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Enable 2FA</h4>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button variant="outline">Set Up 2FA</Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Sessions</h3>
                      <div className="border rounded-lg divide-y">
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">
                              Chrome on Windows • San Francisco, CA • 192.168.1.1
                            </p>
                          </div>
                          <Badge className="bg-green-500">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium">Mobile App</p>
                            <p className="text-sm text-muted-foreground">
                              iPhone 13 • New York, NY • Last active 2 days ago
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <LogOut className="h-4 w-4 mr-2" />
                            Log Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="gap-2">
                      <LogOut className="h-4 w-4" />
                      Log Out of All Devices
                    </Button>
                    <Button onClick={handleSaveSettings}>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
