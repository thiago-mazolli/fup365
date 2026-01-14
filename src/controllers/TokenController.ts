import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { IHeaderProps } from 'dev4-code-library';
import apiLicense from '../services/apiLicense';
import VersionController from './VersionController';

export default class TokenController {
  static async getToken(req: Request, res: Response) {
    const { productkey }: IHeaderProps = req.headers as any;

    if (!productkey) {
      return res
        .status(404)
        .send({ error: 'A Chave do Produto não foi fornecida!' });
    }

    const resp = await apiLicense.get('/getClientByKey', {
      headers: { productkey },
    });

    const { _id: clientid } = resp.data;

    const token = jwt.sign({ usercode: 1, clientid }, productkey, {
      expiresIn: '1d',
    });

    const isOutdateVersion = await VersionController.isOutdateVersion(clientid);
    if (isOutdateVersion) {
      await VersionController.updateToBuildVersion(clientid);
    }

    return res.status(200).send({ token });
  }
}
