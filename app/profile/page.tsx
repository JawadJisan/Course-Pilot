"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Save,
  Upload,
  Edit2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"

// Mock user data - would be fetched from API in a real application
const mockUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=128&width=128",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  occupation: "Senior Software Engineer",
  bio: "Passionate developer with 5+ years of experience in web development. Focused on React, Node.js, and cloud technologies.",
  birthdate: "1990-05-15",
  website: "https://johndoe.dev",
  socialLinks: {
    github: "johndoe",
    linkedin: "johndoe",
    twitter: "johndoe",
  },
  preferences: {
    emailNotifications: true,
    courseRecommendations: true,
    interviewReminders: true,
    darkMode: false,
    publicProfile: true,
  },
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [userData, setUserData] = useState(mockUserData)
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }))
  }

  const handlePreferenceChange = (name: string, checked: boolean) => {
    setUserData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked,
      },
    }))
  }

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
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

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                    >
                      <Upload className="h-4 w-4" />
                      <span className="sr-only">Upload avatar</span>
                    </Button>
                  )}
                </div>
              </div>
              <CardTitle>{userData.name}</CardTitle>
              <CardDescription>{userData.occupation}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.birthdate}</span>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary">
                  {userData.website}
                </a>
              </div>
              <div className="flex justify-center gap-4 pt-2">
                <a
                  href={`https://github.com/${userData.socialLinks.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href={`https://linkedin.com/in/${userData.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a
                  href={`https://twitter.com/${userData.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={isEditing ? "default" : "outline"}
                className="w-full"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="flex-1">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>Preferences</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={userData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        name="occupation"
                        value={userData.occupation}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">Birthdate</Label>
                      <Input
                        id="birthdate"
                        name="birthdate"
                        type="date"
                        value={userData.birthdate}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={userData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="github" className="flex items-center gap-2">
                          <Github className="h-4 w-4" />
                          GitHub
                        </Label>
                        <div className="flex items-center">
                          <span className="bg-muted px-3 py-2 rounded-l-md text-muted-foreground">github.com/</span>
                          <Input
                            id="github"
                            name="github"
                            value={userData.socialLinks.github}
                            onChange={handleSocialLinkChange}
                            disabled={!isEditing}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </Label>
                        <div className="flex items-center">
                          <span className="bg-muted px-3 py-2 rounded-l-md text-muted-foreground">
                            linkedin.com/in/
                          </span>
                          <Input
                            id="linkedin"
                            name="linkedin"
                            value={userData.socialLinks.linkedin}
                            onChange={handleSocialLinkChange}
                            disabled={!isEditing}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="flex items-center gap-2">
                          <Twitter className="h-4 w-4" />
                          Twitter
                        </Label>
                        <div className="flex items-center">
                          <span className="bg-muted px-3 py-2 rounded-l-md text-muted-foreground">twitter.com/</span>
                          <Input
                            id="twitter"
                            name="twitter"
                            value={userData.socialLinks.twitter}
                            onChange={handleSocialLinkChange}
                            disabled={!isEditing}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {isEditing && (
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button className="flex-1" onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Account Preferences</CardTitle>
                  <CardDescription>Manage your account settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications" className="font-medium">
                            Email Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about your courses and account
                          </p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={userData.preferences.emailNotifications}
                          onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="courseRecommendations" className="font-medium">
                            Course Recommendations
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive personalized course recommendations based on your interests
                          </p>
                        </div>
                        <Switch
                          id="courseRecommendations"
                          checked={userData.preferences.courseRecommendations}
                          onCheckedChange={(checked) => handlePreferenceChange("courseRecommendations", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="interviewReminders" className="font-medium">
                            Interview Reminders
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive reminders about upcoming interview sessions
                          </p>
                        </div>
                        <Switch
                          id="interviewReminders"
                          checked={userData.preferences.interviewReminders}
                          onCheckedChange={(checked) => handlePreferenceChange("interviewReminders", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Display</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="darkMode" className="font-medium">
                            Dark Mode
                          </Label>
                          <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
                        </div>
                        <Switch
                          id="darkMode"
                          checked={userData.preferences.darkMode}
                          onCheckedChange={(checked) => handlePreferenceChange("darkMode", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Privacy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="publicProfile" className="font-medium">
                            Public Profile
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Make your profile visible to other CoursePilot users
                          </p>
                        </div>
                        <Switch
                          id="publicProfile"
                          checked={userData.preferences.publicProfile}
                          onCheckedChange={(checked) => handlePreferenceChange("publicProfile", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleSaveProfile}>
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
