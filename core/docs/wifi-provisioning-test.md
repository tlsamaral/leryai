# Teste do Wi-Fi provisioning

O Wi-Fi do Pi vira o hotspot durante o teste, então **uma sessão SSH por Wi-Fi cai**. Teste com o Pi no cabo (Ethernet) ou com monitor e teclado.

## 0. Uma vez só, no Pi

```bash
sudo bash core/scripts/setup_wifi_provisioning.sh
iw list | grep -A8 'Supported interface modes' | grep AP    # tem que listar "* AP"
```

## 1. Ver a página no Mac (sem Pi)

```bash
cd core && python3 scripts/test_wifi_provisioning.py --preview
```

Abra a URL impressa no celular (mesmo Wi-Fi do Mac). Senha certa: `correct123`. Qualquer outra simula senha errada (o AP "reabre").

## 2. Fluxo real no Pi (sem áudio nem LED)

```bash
sudo python3 core/scripts/test_wifi_provisioning.py --forget
```

`--forget` apaga as redes salvas (simula primeiro boot). O terminal mostra o SSID, a senha e o QR. No celular: escanear o QR, entrar no `Lery-Setup-XXXX`, a página abre sozinha, escolher a rede e a senha. Esperado no log: `ap_ready` → `connecting` → `connected`.

## 3. Boot completo (voz + LED + tudo)

```bash
python3 core/src/main.py --reset-wifi && sudo reboot
```

Esperado: LED ciano respirando, Lery fala o aviso, repete a cada 90 s.

## Checklist de cada rodada

- [ ] iPhone: o QR conecta e a página abre sozinha
- [ ] Android: idem (se não abrir, o aviso "Sem internet, tocar para entrar" aparece)
- [ ] Senha errada: Lery avisa, `Lery-Setup` volta, segunda tentativa funciona
- [ ] Rede com espaço/acento no nome e na senha
- [ ] Rede digitada à mão (SSID fora da lista)
- [ ] Rede aberta (sem senha)
- [ ] Rede só 5 GHz: não aparece na lista (Pi 3 B é só 2.4 GHz)
- [ ] Roteador desligado no boot, ligado depois: reconecta sozinho (45 s de espera; depois tenta a cada 3 min)
- [ ] Reboot depois de configurado: volta direto ao IDLE, sem hotspot

## Se algo falhar

| Sintoma | Verificar |
|---|---|
| `Lery-Setup-XXXX` não aparece | `nmcli device status` (wlan0 gerenciado?), `journalctl -u NetworkManager -n 50` |
| Entra no hotspot mas a página não abre sozinha | `cat /etc/NetworkManager/dnsmasq-shared.d/lery-captive.conf` (deve ter `address=/#/10.42.0.1`); abra `http://10.42.0.1` à mão |
| A página não abre nem à mão | `sudo ss -ltnp \| grep :80` (porta ocupada?) e rode como root |
| Conecta no hotspot mas a senha certa falha | `nmcli -t -f NAME,TYPE connection show`; log do NetworkManager |
| Hotspot ficou preso após cancelar | `nmcli connection delete lery-setup-ap` |
