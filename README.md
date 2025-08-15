# 🔍 GitHub Profile Viewer

A sleek and modern web application to explore GitHub profiles and repositories with an intuitive interface.  
Built with **Next.js**, **TypeScript**, and **Tailwind CSS** for performance, style, and scalability.

---

## ✨ Why GitHub Profile Viewer?

**GitHub Profile Viewer** makes exploring GitHub profiles effortless:  
- No need to manually scroll through endless repositories  
- Beautiful, modern UI with dark mode  
- Fully responsive for mobile, tablet, and desktop  
- Built on top of the **GitHub REST API**

### Key Features
- 🔍 **Profile Search** — Enter any GitHub username to explore their profile
- 📊 **Repository Analytics** — See stars, forks, watchers, and more
- 📈 **Advanced Sorting** — Sort repos by stars, forks, size, update date, etc.
- 🔄 **Smart Pagination** — 10 repositories per page for easy navigation
- 🎛️ **Filter Options** — Include/exclude forked or archived repositories
- 🎨 **Modern UI** — Smooth animations and dark theme
- ⚡ **Fast Performance** — Powered by Next.js with ISR

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/HassanXTech/github-profile-viewer.git
cd github-profile-viewer

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Navigate to **http://localhost:3000** to start exploring! 🚀

---

## 🚀 Quick Start

### Search for a Profile
1. Enter a GitHub username
2. View their **profile details** and **repositories**
3. Apply sorting & filters for advanced results

Example:
```ts
import { GithubProfileView } from "@/components/github-profile-view"

export default function Home() {
  return <GithubProfileView username="HassanXTech" />
}
```

---

## 🎨 Features in Detail

### Sorting Options
- Recently updated
- Recently created
- Recently pushed
- Name (A–Z)
- Most stars
- Most forks
- Largest size
- Most watchers

### Filters
- Include forked repositories
- Include archived repositories

### Responsive Design
- Mobile-first approach 📱
- Touch-friendly navigation 🤌
- Optimized for all screen sizes 💻

---

## 🏗 Built With
- **Next.js 14** — React framework for production
- **TypeScript** — Type-safe JavaScript
- **Tailwind CSS** — Utility-first CSS framework
- **GitHub API** — Fetch user & repo data
- **Lucide React** — Icon library
- **Radix UI** — Accessible components

---

## 📁 Project Structure
```plaintext
github-profile-viewer/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── github-profile-view.tsx
│   ├── github-search-section.tsx
│   └── footer-section.tsx
├── lib/
│   └── utils.ts
└── public/
    └── ...
```

---

## 🤝 Contributing
Contributions are welcome!  
To contribute:
```bash
# Fork the project
# Create a feature branch
git checkout -b feature/AmazingFeature
# Commit your changes
git commit -m "Add AmazingFeature"
# Push to branch
git push origin feature/AmazingFeature
# Open a Pull Request
```

---

## 📄 License
MIT License © 2025 [@HassanXTech](https://github.com/HassanXTech)

---

## 👨‍💻 Author
**Hassan Tech**  
🌐 Website: [hassanx.tech](https://hassanx.tech)  
🐙 GitHub: [@HassanXTech](https://github.com/HassanXTech)

---

## 🙏 Acknowledgments
- **GitHub API** for providing comprehensive user/repo data
- **Next.js** team for their incredible framework
- **Tailwind CSS** for the utility-first styling
- **Vercel** for seamless deployment
