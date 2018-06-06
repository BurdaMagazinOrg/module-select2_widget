<?php

namespace Drupal\select2_widget\Service;

use Drupal\Core\Entity\EntityAutocompleteMatcher;
use Drupal\Core\Entity\EntityPublishedInterface;

/**
 * Class Selec2EntityAutocompleteMatcher.
 */
class Selec2EntityAutocompleteMatcher extends EntityAutocompleteMatcher {

  /**
   * {@inheritdoc}
   */
  public function getMatches($target_type, $selection_handler, $selection_settings, $string = '') {
    $matches = [];

    $options = [
      'target_type' => $target_type,
      'handler' => $selection_handler,
      'handler_settings' => $selection_settings,
    ];
    $handler = $this->selectionManager->getInstance($options);

    if (isset($string)) {
      // Get an array of matching entities.
      $match_operator = !empty($selection_settings['match_operator']) ? $selection_settings['match_operator'] : 'CONTAINS';
      $entity_labels = $handler->getReferenceableEntities($string, $match_operator, 50);

      // Loop through the entities and convert them into autocomplete output.
      foreach ($entity_labels as $values) {
        foreach ($values as $entity_id => $label) {
          $entity = \Drupal::entityTypeManager()->getStorage($target_type)->load($entity_id);
          $matches[] = [
            'id' => $entity_id,
            'text' => $label,
            'label' => $entity->label(),
            'status' => $entity instanceof EntityPublishedInterface ? $entity->isPublished() : TRUE,
          ];
        }
      }
    }

    return $matches;
  }

}
