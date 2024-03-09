const development: boolean = !import.meta.env.PROD || import.meta.env.DEV;

export default function isDev(): boolean {
  return development;
}
