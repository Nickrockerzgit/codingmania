ALTER TABLE `users`
  ADD COLUMN `adminAccess` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `superAdminAccess` BOOLEAN NOT NULL DEFAULT false;

UPDATE `users`
SET `adminAccess` = true
WHERE `role` = 'admin'
   OR (`appliedRole` = 'admin' AND `applicationStatus` = 'approved');

UPDATE `users` u
INNER JOIN `join_us` j ON j.`email` = u.`email`
SET u.`adminAccess` = true
WHERE j.`role_applied` = 'admin'
  AND j.`status` = 'approved';

UPDATE `users`
SET `adminAccess` = true,
    `superAdminAccess` = true
WHERE `email` = 'lancer969976@gmail.com';
