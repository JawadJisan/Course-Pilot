"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChevronLeft, Loader2, BookOpen, AlertCircle, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Zod schema for form validation
const generateCourseSchema = z.object({
  experience: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select your experience level",
  }),
  targetRole: z.string().min(2, {
    message: "Target role must be at least 2 characters",
  }),
  techStack: z.array(z.string()).min(1, {
    message: "Please select at least one technology",
  }),
  learningGoals: z.array(z.string()).min(1, {
    message: "Please add at least one learning goal",
  }),
  preferredLearningStyle: z.enum(["video", "articles", "docs"], {
    required_error: "Please select your preferred learning style",
  }),
  preferredResources: z.array(z.string()).min(1, {
    message: "Please select at least one preferred resource",
  }),
  topicsToAvoid: z.array(z.string()).optional(),
})

type GenerateCourseFormValues = z.infer<typeof generateCourseSchema>

// Tech stack options
const techStackOptions = [
  { value: "React", label: "React" },
  { value: "Angular", label: "Angular" },
  { value: "Vue", label: "Vue" },
  { value: "Node.js", label: "Node.js" },
  { value: "Express", label: "Express" },
  { value: "Next.js", label: "Next.js" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "MySQL", label: "MySQL" },
  { value: "GraphQL", label: "GraphQL" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "Python", label: "Python" },
  { value: "Django", label: "Django" },
  { value: "Flask", label: "Flask" },
  { value: "Ruby", label: "Ruby" },
  { value: "Ruby on Rails", label: "Ruby on Rails" },
  { value: "PHP", label: "PHP" },
  { value: "Laravel", label: "Laravel" },
  { value: "AWS", label: "AWS" },
  { value: "Docker", label: "Docker" },
  { value: "Kubernetes", label: "Kubernetes" },
]

// Resource options
const resourceOptions = [
  { id: "youtube", label: "YouTube" },
  { id: "mdn", label: "MDN Web Docs" },
  { id: "devto", label: "Dev.to" },
  { id: "freecodecamp", label: "freeCodeCamp" },
  { id: "udemy", label: "Udemy" },
  { id: "coursera", label: "Coursera" },
  { id: "pluralsight", label: "Pluralsight" },
  { id: "github", label: "GitHub Repositories" },
]

export default function GenerateCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newGoal, setNewGoal] = useState("")
  const [newTopicToAvoid, setNewTopicToAvoid] = useState("")

  // Initialize form with default values
  const form = useForm<GenerateCourseFormValues>({
    resolver: zodResolver(generateCourseSchema),
    defaultValues: {
      experience: "intermediate",
      targetRole: "",
      techStack: [],
      learningGoals: [],
      preferredLearningStyle: "video",
      preferredResources: ["youtube"],
      topicsToAvoid: [],
    },
  })

  // Handle form submission
  async function onSubmit(data: GenerateCourseFormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/courses/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to generate course")
      }

      const result = await response.json()
      router.push(`/courses/${result.data.id}`)
    } catch (err) {
      console.error("Error generating course:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

  // Handle adding a new learning goal
  const addLearningGoal = () => {
    if (newGoal.trim() === "") return
    const currentGoals = form.getValues("learningGoals") || []
    if (!currentGoals.includes(newGoal)) {
      form.setValue("learningGoals", [...currentGoals, newGoal])
      form.trigger("learningGoals")
    }
    setNewGoal("")
  }

  // Handle removing a learning goal
  const removeLearningGoal = (goal: string) => {
    const currentGoals = form.getValues("learningGoals") || []
    form.setValue(
      "learningGoals",
      currentGoals.filter((g) => g !== goal),
    )
    form.trigger("learningGoals")
  }

  // Handle adding a new topic to avoid
  const addTopicToAvoid = () => {
    if (newTopicToAvoid.trim() === "") return
    const currentTopics = form.getValues("topicsToAvoid") || []
    if (!currentTopics.includes(newTopicToAvoid)) {
      form.setValue("topicsToAvoid", [...currentTopics, newTopicToAvoid])
    }
    setNewTopicToAvoid("")
  }

  // Handle removing a topic to avoid
  const removeTopicToAvoid = (topic: string) => {
    const currentTopics = form.getValues("topicsToAvoid") || []
    form.setValue(
      "topicsToAvoid",
      currentTopics.filter((t) => t !== topic),
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/courses">My Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Generate New Course</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Generate Your Personalized Course</h1>
              <p className="text-muted-foreground">
                Tell us about your background and preferences, and our AI will create a customized learning path just
                for you.
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Background</CardTitle>
                    <CardDescription>Tell us about your current experience level and career goals</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This helps us tailor the content to your current knowledge level
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Role</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Full Stack Developer, Data Scientist" {...field} />
                          </FormControl>
                          <FormDescription>What role are you aiming to prepare for?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technologies & Goals</CardTitle>
                    <CardDescription>Select the technologies you want to learn and your learning goals</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="techStack"
                      render={() => (
                        <FormItem>
                          <FormLabel>Tech Stack</FormLabel>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {techStackOptions.map((option) => (
                                <FormField
                                  key={option.value}
                                  control={form.control}
                                  name="techStack"
                                  render={({ field }) => {
                                    return (
                                      <Badge
                                        variant={field.value?.includes(option.value) ? "default" : "outline"}
                                        className="cursor-pointer hover:bg-primary/90 transition-colors"
                                        onClick={() => {
                                          const current = field.value || []
                                          const updated = current.includes(option.value)
                                            ? current.filter((value) => value !== option.value)
                                            : [...current, option.value]
                                          field.onChange(updated)
                                        }}
                                      >
                                        {option.label}
                                      </Badge>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <FormDescription>Select the technologies you want to learn</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="learningGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Learning Goals</FormLabel>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((goal) => (
                                <Badge key={goal} className="gap-1 pr-1">
                                  {goal}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 rounded-full"
                                    onClick={() => removeLearningGoal(goal)}
                                  >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">Remove {goal}</span>
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="e.g. Learn authentication patterns"
                                value={newGoal}
                                onChange={(e) => setNewGoal(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    addLearningGoal()
                                  }
                                }}
                              />
                              <Button type="button" size="sm" onClick={addLearningGoal}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                          <FormDescription>What specific skills or concepts do you want to master?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Preferences</CardTitle>
                    <CardDescription>Tell us how you prefer to learn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="preferredLearningStyle"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Preferred Learning Style</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="video" />
                                </FormControl>
                                <FormLabel className="font-normal">Video Tutorials</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="articles" />
                                </FormControl>
                                <FormLabel className="font-normal">Articles & Blog Posts</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="docs" />
                                </FormControl>
                                <FormLabel className="font-normal">Documentation & Reference</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>How do you prefer to consume learning content?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredResources"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Preferred Resources</FormLabel>
                            <FormDescription>Select your preferred learning platforms</FormDescription>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {resourceOptions.map((resource) => (
                              <FormField
                                key={resource.id}
                                control={form.control}
                                name="preferredResources"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={resource.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(resource.id)}
                                          onCheckedChange={(checked) => {
                                            const current = field.value || []
                                            return checked
                                              ? field.onChange([...current, resource.id])
                                              : field.onChange(current.filter((value) => value !== resource.id))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{resource.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="topicsToAvoid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topics to Avoid</FormLabel>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {field.value?.map((topic) => (
                                <Badge key={topic} variant="secondary" className="gap-1 pr-1">
                                  {topic}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 rounded-full"
                                    onClick={() => removeTopicToAvoid(topic)}
                                  >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">Remove {topic}</span>
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="e.g. Basic JavaScript syntax"
                                value={newTopicToAvoid}
                                onChange={(e) => setNewTopicToAvoid(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    addTopicToAvoid()
                                  }
                                }}
                              />
                              <Button type="button" size="sm" variant="outline" onClick={addTopicToAvoid}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                          <FormDescription>
                            Optional: Specify any topics you already know or want to skip
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/courses">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to My Courses
                    </Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate My Course
                        <BookOpen className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="w-full md:w-1/3">
            <div className="sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>Our AI creates personalized learning paths just for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Fill out the form</h4>
                      <p className="text-sm text-muted-foreground">
                        Tell us about your experience, goals, and learning preferences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">AI generates your course</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI creates a tailored curriculum with curated resources
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Start learning</h4>
                      <p className="text-sm text-muted-foreground">
                        Follow your personalized path and track your progress
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Practice with AI interviews</h4>
                      <p className="text-sm text-muted-foreground">
                        Test your knowledge with AI-powered mock interviews
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Example Course</CardTitle>
                  <CardDescription>Here's what your personalized course might look like</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">Full Stack Development with React & Node.js</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        A comprehensive learning path for intermediate developers
                      </p>
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-medium mb-2">Modules include:</div>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          Authentication Fundamentals
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          React Performance Optimization
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          PostgreSQL Data Modeling
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          Full Stack Project Implementation
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
