export function scrollToSection(event: Event, targetId: string) {
  event.preventDefault();

  const targetSection = document.querySelector(targetId) as HTMLElement;
  if (!targetSection) return;

  const rect = targetSection.getBoundingClientRect();
  const header = document.querySelector('header') as HTMLElement;
  const headerHeight = header ? header.offsetHeight : 0;
  const newPosition = window.scrollY + rect.top - headerHeight;

  window.scroll({
    behavior: 'smooth',
    top: newPosition + 1,
  });
}

export function openPage(event: MouseEvent, url: string | null): void {
  if (url) {
    window.open(url, '_blank');
  }
  event.preventDefault();
  return;
}

export function printMessage(event: MouseEvent, message: string): void {
  alert(message);
  event.preventDefault();
  return;
}
