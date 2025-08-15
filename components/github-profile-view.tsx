"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  LinkIcon,
  BookOpen,
  Star,
  GitFork,
  Eye,
  Calendar,
  Search,
  ExternalLink,
  Activity,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  location: string
  blog: string
  followers: number
  following: number
  public_repos: number
  public_gists: number
  created_at: string
}

interface GitHubRepo {
  id: number
  name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  updated_at: string
  html_url: string
  fork: boolean
  archived: boolean
  size: number
  watchers_count: number
  created_at: string
  pushed_at: string
}

interface GitHubProfileViewProps {
  username: string
}

export function GitHubProfileView({ username }: GitHubProfileViewProps) {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("updated")
  const [showForked, setShowForked] = useState(true)
  const [showArchived, setShowArchived] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const reposPerPage = 10

  useEffect(() => {
    if (username) {
      fetchGitHubData()
    }
  }, [username])

  const fetchGitHubData = async () => {
    setLoading(true)
    setError(null)

    try {
      const userResponse = await fetch(`https://api.github.com/users/${username}`)
      if (!userResponse.ok) {
        throw new Error("User not found")
      }
      const userData = await userResponse.json()
      setUser(userData)

      const allRepos: GitHubRepo[] = []
      let page = 1
      let hasMore = true

      while (hasMore && page <= 20) {
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=${sortBy}&per_page=100&page=${page}`,
        )
        if (!reposResponse.ok) {
          throw new Error("Failed to fetch repositories")
        }
        const reposData = await reposResponse.json()

        if (reposData.length === 0) {
          hasMore = false
        } else {
          allRepos.push(...reposData)
          page++
          if (reposData.length < 100) {
            hasMore = false
          }
        }
      }

      setRepos(allRepos)
      setCurrentPage(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const filteredRepos = repos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesForked = showForked || !repo.fork
    const matchesArchived = showArchived || !repo.archived

    return matchesSearch && matchesForked && matchesArchived
  })

  const sortedRepos = [...filteredRepos].sort((a, b) => {
    switch (sortBy) {
      case "stars":
        return b.stargazers_count - a.stargazers_count
      case "forks":
        return b.forks_count - a.forks_count
      case "size":
        return b.size - a.size
      case "watchers":
        return b.watchers_count - a.watchers_count
      case "updated":
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      case "created":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "pushed":
        return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
      case "full_name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const totalPages = Math.ceil(sortedRepos.length / reposPerPage)
  const startIndex = (currentPage - 1) * reposPerPage
  const endIndex = startIndex + reposPerPage
  const paginatedRepos = sortedRepos.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const reposSection = document.getElementById("repositories-section")
    if (reposSection) {
      reposSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Java: "#b07219",
      "C++": "#f34b7d",
      C: "#555555",
      "C#": "#239120",
      PHP: "#4F5D95",
      Ruby: "#701516",
      Go: "#00ADD8",
      Rust: "#dea584",
      Swift: "#ffac45",
      Kotlin: "#F18E33",
      Dart: "#00B4AB",
      HTML: "#e34c26",
      CSS: "#1572B6",
      Vue: "#2c3e50",
      React: "#61DAFB",
    }
    return colors[language] || "#8b949e"
  }

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)

  const sortOptions = [
    { value: "updated", label: "Recently updated" },
    { value: "created", label: "Recently created" },
    { value: "pushed", label: "Recently pushed" },
    { value: "full_name", label: "Name" },
    { value: "stars", label: "Most stars" },
    { value: "forks", label: "Most forks" },
    { value: "size", label: "Largest size" },
    { value: "watchers", label: "Most watchers" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div id="profile-section" className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 px-2 sm:px-0">
      {/* User Profile Sidebar */}
      <div className="lg:col-span-1">
        <Card className="bg-card/50 border-border backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-primary/20">
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name || user.login} />
                <AvatarFallback className="text-xl sm:text-2xl">{user.login.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{user.name || user.login}</h2>
                <p className="text-muted-foreground text-base sm:text-lg">@{user.login}</p>
              </div>

              {user.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg">{user.bio}</p>
              )}

              <div className="w-full space-y-3 text-sm">
                {user.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.blog && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LinkIcon className="w-4 h-4" />
                    <a
                      href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary truncate transition-colors"
                    >
                      {user.blog}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full text-center">
                <div className="bg-muted/10 p-2 sm:p-3 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-foreground">{user.followers}</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
                <div className="bg-muted/10 p-2 sm:p-3 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-foreground">{user.following}</div>
                  <div className="text-xs text-muted-foreground">Following</div>
                </div>
                <div className="bg-muted/10 p-2 sm:p-3 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-foreground">{user.public_repos}</div>
                  <div className="text-xs text-muted-foreground">Repositories</div>
                </div>
                <div className="bg-muted/10 p-2 sm:p-3 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-foreground">{totalStars}</div>
                  <div className="text-xs text-muted-foreground">Total Stars</div>
                </div>
              </div>

              <div className="w-full bg-muted/10 p-3 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">View contributions on GitHub</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repositories Section */}
      <div className="lg:col-span-2">
        <Card className="bg-card/50 border-border backdrop-blur-sm">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2" id="repositories-section">
                <BookOpen className="w-5 h-5" />
                Public Repositories ({sortedRepos.length})
              </CardTitle>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-between gap-2 px-3 py-2 bg-background/80 border border-border/50 rounded-md text-sm min-w-[160px] hover:bg-background/90 hover:border-border transition-all duration-200 shadow-sm"
                  >
                    <span className="text-foreground">
                      {sortOptions.find((option) => option.value === sortBy)?.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-md shadow-xl z-50 overflow-hidden">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value)
                            setDropdownOpen(false)
                            setCurrentPage(1)
                          }}
                          className={`w-full text-left px-3 py-2.5 text-sm transition-all duration-150 ${
                            sortBy === option.value
                              ? "bg-primary/10 text-primary border-l-2 border-l-primary"
                              : "text-foreground hover:bg-muted/20 hover:text-primary"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowForked(!showForked)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 border shadow-sm ${
                  showForked
                    ? "bg-primary/15 border-primary/40 text-primary hover:bg-primary/20"
                    : "bg-background/60 border-border/50 text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    showForked
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/50 hover:border-muted-foreground"
                  }`}
                >
                  {showForked && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                </div>
                Include forked
              </button>

              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 border shadow-sm ${
                  showArchived
                    ? "bg-primary/15 border-primary/40 text-primary hover:bg-primary/20"
                    : "bg-background/60 border-border/50 text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    showArchived
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/50 hover:border-muted-foreground"
                  }`}
                >
                  {showArchived && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                </div>
                Include archived
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="space-y-0">
              {paginatedRepos.map((repo, index) => (
                <div
                  key={repo.id}
                  className={`p-4 border-b border-border/50 last:border-b-0 hover:bg-muted/10 transition-colors duration-200 ${
                    index === 0 ? "rounded-t-lg" : ""
                  } ${index === paginatedRepos.length - 1 ? "rounded-b-lg" : ""}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium text-base sm:text-lg truncate"
                        >
                          {repo.name}
                        </a>
                        {repo.fork && (
                          <Badge variant="outline" className="text-xs">
                            Forked
                          </Badge>
                        )}
                        {repo.archived && (
                          <Badge variant="outline" className="text-xs">
                            Archived
                          </Badge>
                        )}
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      {repo.description && (
                        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{repo.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                        {repo.language && (
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getLanguageColor(repo.language) }}
                            />
                            <span>{repo.language}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span>{repo.stargazers_count}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          <span>{repo.forks_count}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{repo.watchers_count}</span>
                        </div>

                        {repo.open_issues_count > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                            <span>{repo.open_issues_count} issues</span>
                          </div>
                        )}

                        <span>Updated {formatDate(repo.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {paginatedRepos.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No repositories found matching your criteria.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border/50 bg-muted/5">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, sortedRepos.length)} of {sortedRepos.length} repositories
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 bg-background/50 hover:bg-background/80"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 7) {
                        pageNum = i + 1
                      } else if (currentPage <= 4) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i
                      } else {
                        pageNum = currentPage - 3 + i
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 p-0 ${
                            currentPage === pageNum
                              ? "bg-primary text-primary-foreground"
                              : "bg-background/50 hover:bg-background/80"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 bg-background/50 hover:bg-background/80"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
