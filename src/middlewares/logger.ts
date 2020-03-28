import { Request, Response } from 'express';
import * as morgan from 'morgan';

function ipv6to4(ipv6: string | undefined) {
  if (ipv6) {
    return ipv6.startsWith('::ffff:') ? ipv6.substring(7) : ipv6;
  }
  return undefined;
}

morgan.token('remote-addr', (req: Request, res: Response) => ipv6to4(req.ip || req.connection.remoteAddress));

morgan.token('date', (req: Request, res: Response) => new Date().toISOString());

morgan.token('url', (req: Request, res: Response) => decodeURI(req.path));

export default morgan('[:date] <:remote-addr> :method :status :response-time ms ":url"');
