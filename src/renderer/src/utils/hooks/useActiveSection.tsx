import { useEffect, useRef, useState } from 'react'

export const useActiveSection = (sectionIds: string[]): string | null => {
    const [activeSection, setActiveSection] = useState(sectionIds[0] ?? null)
    const visibleSet = useRef(new Set())

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.id
                    if (entry.isIntersecting) {
                        visibleSet.current.add(id)
                    } else {
                        visibleSet.current.delete(id)
                    }
                })

                if (visibleSet.current.size === 0) return

                // Elegimos la primera en orden vertical (según sectionIds, que
                // debe reflejar el orden real en el DOM)
                const first = sectionIds.find((id) => visibleSet.current.has(id))
                if (first) setActiveSection(first)
            },
            {
                root: null, // viewport, o el contenedor scrolleable si es interno
                rootMargin: '0px',
                threshold: 0.1 // ajustable: qué % visible cuenta como "entró"
            }
        )

        sectionIds.forEach((id) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [sectionIds])

    return activeSection
}
