import React, { useEffect, useRef, useCallback } from 'react';
import type { QuickProject } from './types';

interface ProjectMarqueeIslandProps {
  projects: QuickProject[];
}

const ProjectMarqueeIsland: React.FC<ProjectMarqueeIslandProps> = React.memo(({ projects: projectData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /** Create a single project card using safe DOM APIs (no innerHTML) */
  const createProjectCard = useCallback((project: QuickProject) => {
    const card = document.createElement('div');
    card.className = 'project-card-marquee';
    card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${CSS.escape(project.image)})`;

    // Content wrapper
    const content = document.createElement('div');
    content.className = 'project-card-content';

    // Header: number + type
    const header = document.createElement('div');
    header.className = 'project-card-header';

    const number = document.createElement('div');
    number.className = 'project-number';
    number.textContent = project.id;

    const type = document.createElement('div');
    type.className = 'project-type';
    type.textContent = project.type;

    header.appendChild(number);
    header.appendChild(type);

    // Body: title + description
    const body = document.createElement('div');
    body.className = 'project-card-body';

    const title = document.createElement('h3');
    title.className = 'project-card-title';
    title.textContent = project.title;

    const desc = document.createElement('p');
    desc.className = 'project-card-description';
    desc.textContent = project.description;

    body.appendChild(title);
    body.appendChild(desc);

    // Footer: tags + visit button
    const footer = document.createElement('div');
    footer.className = 'project-card-footer';

    const tags = document.createElement('div');
    tags.className = 'project-tags';
    for (const tagText of project.tags) {
      const tag = document.createElement('span');
      tag.className = 'project-tag';
      tag.textContent = tagText;
      tags.appendChild(tag);
    }

    const visitBtn = document.createElement('button');
    visitBtn.className = 'project-visit-btn';
    visitBtn.dataset.url = project.url;

    const visitText = document.createElement('span');
    visitText.className = 'visit-text';
    visitText.textContent = 'Visit';

    const visitIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    visitIcon.setAttribute('class', 'visit-icon');
    visitIcon.setAttribute('width', '12');
    visitIcon.setAttribute('height', '12');
    visitIcon.setAttribute('viewBox', '0 0 24 24');
    visitIcon.setAttribute('fill', 'none');
    visitIcon.setAttribute('stroke', 'currentColor');
    visitIcon.setAttribute('stroke-width', '2');
    visitIcon.setAttribute('stroke-linecap', 'round');
    visitIcon.setAttribute('stroke-linejoin', 'round');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M7 17L17 7M17 7H7M17 7V17');
    visitIcon.appendChild(path);

    visitBtn.appendChild(visitText);
    visitBtn.appendChild(visitIcon);

    visitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = visitBtn.dataset.url;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    });

    footer.appendChild(tags);
    footer.appendChild(visitBtn);

    content.appendChild(header);
    content.appendChild(body);
    content.appendChild(footer);
    card.appendChild(content);

    // Card-level click
    card.addEventListener('click', (e) => {
      if (!(e.target as Element).closest('.project-visit-btn')) {
        if (project.url) window.open(project.url, '_blank', 'noopener,noreferrer');
      }
    });

    return card;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Build marquee DOM
    const buildMarquee = (items: QuickProject[], reverse: boolean) => {
      const wrapper = document.createElement('div');
      wrapper.className = reverse
        ? 'project-marquee-wrapper project-marquee-reverse'
        : 'project-marquee-wrapper';

      const track = document.createElement('div');
      track.className = reverse
        ? 'project-marquee project-marquee-opposite'
        : 'project-marquee';

      // Two identical sets for seamless loop
      for (let i = 0; i < 2; i++) {
        const set = document.createElement('div');
        set.className = 'project-set';
        for (const project of items) {
          set.appendChild(createProjectCard(project));
        }
        track.appendChild(set);
      }

      wrapper.appendChild(track);
      return wrapper;
    };

    // First marquee (normal order)
    container.appendChild(buildMarquee(projectData, false));

    // Second marquee (reversed order)
    container.appendChild(buildMarquee([...projectData].reverse(), true));

    // Pause animation when off-screen
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const marquees = entry.target.querySelectorAll<HTMLElement>('.project-marquee');
          const state = entry.isIntersecting ? 'running' : 'paused';
          for (const m of marquees) {
            m.style.animationPlayState = state;
          }
        }
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    );
    observerRef.current.observe(container);

    return () => {
      observerRef.current?.disconnect();
      container.innerHTML = '';
    };
  }, [projectData, createProjectCard]);

  return (
    <div ref={containerRef} className="project-marquee-container">
      {/* Container populated by vanilla JS for marquee performance */}
    </div>
  );
});

export default ProjectMarqueeIsland;
