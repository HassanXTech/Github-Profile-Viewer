"use client"

import { useState } from "react"
import { GitHubSearchSection } from "@/components/github-search-section"
import { GitHubProfileView } from "@/components/github-profile-view"
import { FooterSection } from "@/components/footer-section"

export default function GitHubProfileViewer() {
  const [username, setUsername] = useState("")
  const [searchedUser, setSearchedUser] = useState("")

  const handleSearch = (searchUsername: string) => {
    setSearchedUser(searchUsername)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative z-10">
        <main className="w-full max-w-[1320px] mx-auto relative px-4 sm:px-6 lg:px-8">
          <GitHubSearchSection onSearch={handleSearch} />
        </main>

        {searchedUser && (
          <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <GitHubProfileView username={searchedUser} />
          </div>
        )}

        <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <FooterSection />
        </div>
      </div>
    </div>
  )
}
