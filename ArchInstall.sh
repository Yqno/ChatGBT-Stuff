#!/bin/bash

# Determine if UEFI or BIOS boot mode
if [ -d "/sys/firmware/efi/" ]; then
  BOOT_MODE="UEFI"
else
  BOOT_MODE="BIOS"
fi

# Partition the storage
if [ "$BOOT_MODE" == "UEFI" ]; then
  parted /dev/sda mklabel gpt
  parted /dev/sda mkpart ESP fat32 1MiB 513MiB
  parted /dev/sda set 1 boot on
  parted /dev/sda mkpart primary ext4 513MiB 100%
  mkfs.fat -F32 /dev/sda1
  mkfs.ext4 /dev/sda2
else
  parted /dev/sda mklabel msdos
  parted /dev/sda mkpart primary ext4 1MiB 100%
  mkfs.ext4 /dev/sda1
fi

# Mount the partition
mount /dev/sda2 /mnt

# Install Arch Linux and KDE, excluding games packages
pacstrap /mnt base base-devel kde-applications kde-frameworks Network-Manager
sed -i '/games/d' /mnt/etc/pacman.conf

# Generate fstab
genfstab -U /mnt >> /mnt/etc/fstab

# Chroot into the new installation
arch-chroot /mnt

# Set the timezone
ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime
hwclock --systohc

# Localization
echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf

# Network configuration
echo "MyHostname" > /etc/hostname

# Boot loader
if [ "$BOOT_MODE" == "UEFI" ]; then
  pacman -S grub efibootmgr
  grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
  grub-mkconfig -o /boot/grub/grub.cfg
else
  pacman -S grub
  grub-install /dev/sda
  grub-mkconfig -o /boot/grub/grub.cfg
fi

# Exit chroot and reboot
exit
umount /mnt
reboot
