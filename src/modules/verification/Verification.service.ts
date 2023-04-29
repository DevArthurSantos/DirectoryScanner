import Api from '../../api';

class Verification {

  constructor() {
    this.verifyUrlValidity = this.verifyUrlValidity.bind(this);
  }

  async verifyUrlValidity(url: string): Promise<{ status: number, msg: string }> {
    const isValidUrl = url.toLocaleLowerCase().startsWith('http://') ? url : url.toLocaleLowerCase().startsWith("https://") ? url : false
    if (!isValidUrl) {
      return {
        status: 400,
        msg: "Informe um protocolo http ou https!"
      }
    }
    
    try {
      const response = await Api.get(url);
      if (response.status === 200) {
        return {
          status: 200,
          msg: ""
        };
      } else {
        return {
          status: 400,
          msg: "`URL invalida."
        }
      }

    } catch (error) {
      return {
        status: 400,
        msg: "`URL invalida."
      }
    }
  }
}

export default new Verification()
