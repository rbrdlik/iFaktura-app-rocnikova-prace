import Swal from "sweetalert2";

/**
 * Informační alert v pravém horním rohu.
 * @param {Object} icon - Ikona, která se v alertu zobrazí (`success`, `error`, atd..).
 * @param {Object} title - Text v alertu.
 */
export const mixinAlert = (icon, title) => {
  const Alert = Swal.mixin({
    toast: true,
    position: "top-end",
    timer: 4000,
    color: "black",
    showConfirmButton: false,
    timerProgressBar: true,
  });
  Alert.fire({
    icon: icon,
    title: title,
  });
}
