const localMedia = {
  'https://i.ibb.co.com/d0sL4g8D/Screenshot-2025-09-12-083216.png': '/assets/projects/project-0.png',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop': '/assets/projects/project-1.jpg',
  'https://i.ibb.co.com/WW6wVdrM/Screenshot-2025-09-12-084241.png': '/assets/projects/project-2.png',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop': '/assets/projects/project-6.jpg',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800': '/assets/journal/post-0.jpg',
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800': '/assets/journal/post-1.jpg',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800': '/assets/journal/post-3.jpg',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800': '/assets/journal/post-4.jpg',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800': '/assets/journal/post-5.jpg',
};
const unavailableMedia = new Set([
  'https://i.ibb.co.com/ZzJfBprf/Screenshot-2025-09-12-084323.png',
  'https://i.ibb.co.com/PZxWKZjY/Screenshot-2025-09-12-085131.png',
  'https://i.ibb.co.com/ZRPtqc8r/Screenshot-2025-09-12-083813.png',
  'https://i.ibb.co.com/zhPWXKYC/Screenshot-2025-09-12-084711.png',
  'https://i.ibb.co/xqrxyqr3/Screenshot-2025-09-12-133703.png',
  'https://images.unsplash.com/photo-1551288049-bbbda536ad79?auto=format&fit=crop&q=80&w=800',
]);
export const portfolioMedia = source => unavailableMedia.has(source) ? null : localMedia[source] || source;
