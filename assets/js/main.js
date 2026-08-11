const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  const setNavOpen = (open) => {
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };

  navToggle.addEventListener('click', () => {
    setNavOpen(!navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) {
      setNavOpen(false);
      navToggle.focus();
    }
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const filters = document.querySelectorAll('[data-filter]');
const matches = document.querySelectorAll('[data-game]');
const archiveCount = document.querySelector('[data-archive-count]');
const applyArchiveFilter = (value) => {
  filters.forEach((b) => {
    const active = b.dataset.filter === value;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', String(active));
  });
  let visibleCount = 0;
  matches.forEach((card) => {
    const hidden = value !== 'all' && card.dataset.game !== value;
    card.hidden = hidden;
    if (!hidden) visibleCount += 1;
  });
  if (archiveCount) archiveCount.textContent = String(visibleCount);
};

filters.forEach((button) => {
  button.addEventListener('click', () => applyArchiveFilter(button.dataset.filter));
});

if (filters.length && matches.length) {
  const requestedGame = new URLSearchParams(window.location.search).get('game');
  if (['expa','ex2','ex3'].includes(requestedGame)) applyArchiveFilter(requestedGame);
}

document.querySelectorAll('.lite-video:not(.match-stage-video)').forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.video;
    const start = Number(button.dataset.start || 0);
    const iframe = document.createElement('iframe');
    const startParam = start > 0 ? `&start=${start}` : '';
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${startParam}`;
    iframe.title = button.getAttribute('aria-label') || 'SFEXOnline YouTube video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    button.replaceChildren(iframe);
    button.style.cursor = 'default';
  }, { once: true });
});


const matchStage = document.querySelector('[data-match-stage]');
if (matchStage) {
  const matchData = {
    expa: {
      video: '0N3A4JjT6iQ', start: 7,
      poster: 'assets/images/match-expa.webp',
      alt: 'MasterFighterX vs Cahit Street Fighter EX Plus Alpha thumbnail',
      aria: 'Play MasterFighterX vs Cahit in Street Fighter EX Plus Alpha',
      chip: 'HYPE SET', meta: 'EX PLUS ALPHA • FEATURED',
      title: 'MasterFighterX vs Cahit',
      description: 'Short, sharp and one of the strongest matches in the SFEXOnline archive.',
      why: 'Pure EX Plus Alpha at its best: quick, direct and a strong first taste of the game.',
      youtube: 'https://www.youtube.com/watch?v=0N3A4JjT6iQ&t=7s',
      explore: 'games/ex-plus-alpha/', exploreText: 'Explore EX Plus Alpha'
    },
    ex2: {
      video: 'y0rsZ537pKw', start: 7,
      poster: 'assets/images/match-ex2.webp',
      alt: 'MasterFighterX vs VegaChamp Street Fighter EX2 Plus thumbnail',
      aria: 'Play MasterFighterX vs VegaChamp in Street Fighter EX2 Plus',
      chip: 'FIGHTER GUIDE #3', meta: 'EX2 PLUS • FIGHTER GUIDE #3',
      title: 'MasterFighterX vs VegaChamp',
      description: 'A strong EX2 Plus set featuring VegaChamp, with a direct connection to EX Fighter Guide #3.',
      why: 'This one joins the archive and the guide series together: watch the character in a real set, then go deeper.',
      youtube: 'https://www.youtube.com/watch?v=y0rsZ537pKw&t=7s',
      explore: 'games/ex2-plus/', exploreText: 'Explore EX2 Plus'
    },
    ex3: {
      video: '3CTHi_XM7hc', start: 0,
      poster: 'assets/images/match-ex3.webp',
      alt: 'ShinjiGohan vs Justin Wong Street Fighter EX3 UFGT8 2012 Grand Finals thumbnail',
      aria: 'Play ShinjiGohan vs Justin Wong Street Fighter EX3 Grand Finals',
      chip: 'ARCHIVE HISTORY', meta: 'EX3 • UFGT8 2012',
      title: 'ShinjiGohan vs Justin Wong',
      description: 'Historic UFGT8 Grand Finals footage that shows the Street Fighter EX archive reaches back long before SFEXOnline.',
      why: 'Justin Wong and ShinjiGohan make this a doorway into EX3 history, not just another recent upload.',
      youtube: 'https://www.youtube.com/watch?v=3CTHi_XM7hc',
      explore: 'games/ex3/', exploreText: 'Explore EX3'
    }
  };

  const tabs = [...matchStage.querySelectorAll('[data-match-key]')];
  const videoButton = matchStage.querySelector('.match-stage-video');
  const poster = matchStage.querySelector('[data-match-poster]');
  const chip = matchStage.querySelector('[data-match-chip]');
  const meta = matchStage.querySelector('[data-match-meta]');
  const title = matchStage.querySelector('[data-match-title]');
  const description = matchStage.querySelector('[data-match-description]');
  const why = matchStage.querySelector('[data-match-why]');
  const youtube = matchStage.querySelector('[data-match-youtube]');
  const explore = matchStage.querySelector('[data-match-explore]');

  const loadStagePlayer = () => {
    if (videoButton.querySelector('iframe')) return;
    const id = videoButton.dataset.video;
    const start = Number(videoButton.dataset.start || 0);
    const startParam = start > 0 ? `&start=${start}` : '';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${startParam}`;
    iframe.title = videoButton.getAttribute('aria-label') || 'SFEXOnline YouTube video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.style.width = '100%'; iframe.style.height = '100%'; iframe.style.border = '0';
    videoButton.replaceChildren(iframe);
    videoButton.style.cursor = 'default';
  };
  videoButton.addEventListener('click', loadStagePlayer);

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const data = matchData[tab.dataset.matchKey];
      if (!data || tab.classList.contains('active')) return;
      tabs.forEach((item) => { item.classList.toggle('active', item === tab); item.setAttribute('aria-selected', String(item === tab)); });
      matchStage.classList.add('is-switching');
      window.setTimeout(() => {
        videoButton.replaceChildren();
        const img = document.createElement('img');
        img.loading = 'lazy'; img.src = data.poster; img.alt = data.alt; img.setAttribute('data-match-poster','');
        const scan = document.createElement('span'); scan.className = 'match-stage-scan'; scan.setAttribute('aria-hidden','true');
        const play = document.createElement('span'); play.className = 'play-orb match-stage-play'; play.setAttribute('aria-hidden','true'); play.textContent = '▶';
        const chipEl = document.createElement('span'); chipEl.className = 'match-chip'; chipEl.setAttribute('data-match-chip',''); chipEl.textContent = data.chip;
        videoButton.append(img, scan, play, chipEl);
        videoButton.dataset.video = data.video; videoButton.dataset.start = String(data.start); videoButton.setAttribute('aria-label',data.aria); videoButton.style.cursor='pointer';
        meta.textContent = data.meta; title.textContent = data.title; description.textContent = data.description; why.textContent = data.why;
        youtube.href = data.youtube; explore.href = data.explore; explore.textContent = data.exploreText;
        matchStage.classList.remove('is-switching');
      }, 150);
    });
  });
}


const dispatchForm = document.querySelector('[data-dispatch-form]');
const dispatchSuccess = document.querySelector('[data-dispatch-success]');
if (dispatchForm && dispatchSuccess) {
  dispatchForm.addEventListener('submit', () => {
    window.setTimeout(() => {
      dispatchForm.hidden = true;
      dispatchSuccess.hidden = false;
      dispatchSuccess.focus?.();
    }, 180);
  });
}

const dispatchFormSecondary = document.querySelector('[data-dispatch-form-secondary]');
const dispatchSuccessSecondary = document.querySelector('[data-dispatch-success-secondary]');
if (dispatchFormSecondary && dispatchSuccessSecondary) {
  dispatchFormSecondary.addEventListener('submit', () => {
    window.setTimeout(() => {
      dispatchFormSecondary.hidden = true;
      dispatchSuccessSecondary.hidden = false;
      dispatchSuccessSecondary.focus?.();
    }, 180);
  });
}
